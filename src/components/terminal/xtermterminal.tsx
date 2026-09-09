import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Plus, X, GripHorizontal } from 'lucide-react';
import '@xterm/xterm/css/xterm.css';

interface Tab {
  id: string;
  title: string;
}

export default function TerminalBody() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Terminal 1' },
    { id: '2', title: 'Terminal 2' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [height, setHeight] = useState<number>(350);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const xtermInstances = useRef<Record<string, Terminal>>({});
  const fitAddons = useRef<Record<string, FitAddon>>({});
  const socketInstances = useRef<Record<string, WebSocket>>({});
  const reconnectAttempts = useRef<Record<string, number>>({});

  const isDragging = useRef<boolean>(false);
  const startY = useRef<number>(0);
  const startHeight = useRef<number>(0);

  const createWebSocket = (tabId: string, term: Terminal) => {
    // Close existing socket if any
    if (socketInstances.current[tabId]) {
      socketInstances.current[tabId].close();
    }

    console.log(`Creating WebSocket connection for tab ${tabId}...`);
    // Connect to FastAPI WebSocket endpoint - using port 4000 and /terminal path
    const socket = new WebSocket("ws://127.0.0.1:4000/terminal");

    socket.onopen = () => {
      console.log(`WebSocket connected for tab ${tabId}`);
      term.writeln('\x1b[1;32mConnected to terminal server\x1b[0m');
      term.write('\r\n$ ');
      // Reset reconnect attempts on successful connection
      reconnectAttempts.current[tabId] = 0;
    };

    socket.onmessage = (event) => {
      // Handle both text and binary data
      if (typeof event.data === 'string') {
        term.write(event.data);
      } else if (event.data instanceof Blob) {
        // Handle binary data as Blob
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            term.write(reader.result);
          }
        };
        reader.readAsText(event.data);
      } else if (event.data instanceof ArrayBuffer) {
        // Handle binary data as ArrayBuffer
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(event.data);
        term.write(text);
      } else {
        // Fallback for other types
        term.write(event.data);
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for tab ${tabId}:`, error);
      term.writeln('\r\n\x1b[1;31mConnection error - retrying...\x1b[0m');
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed for tab ${tabId}:`, event.code, event.reason);
      term.writeln('\r\n\x1b[1;33mConnection closed - attempting to reconnect...\x1b[0m');
      
      // Attempt to reconnect after delay
      const attempts = (reconnectAttempts.current[tabId] || 0) + 1;
      reconnectAttempts.current[tabId] = attempts;
      
      if (attempts <= 5) {
        setTimeout(() => {
          console.log(`Reconnecting attempt ${attempts} for tab ${tabId}`);
          createWebSocket(tabId, term);
        }, 2000 * attempts); // Exponential backoff
      } else {
        term.writeln('\x1b[1;31mFailed to reconnect after 5 attempts\x1b[0m');
      }
    };

    return socket;
  };

  useEffect(() => {
    tabs.forEach((tab) => {
      const container = containerRefs.current[tab.id];
      if (container && !xtermInstances.current[tab.id]) {
        const term = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          theme: {
            background: '#1a1a1a',
            foreground: '#f8fafc',
            cursor: '#f8fafc',
          },
        });
        const fitAddon = new FitAddon();

        term.loadAddon(fitAddon);
        term.open(container);

        // Create WebSocket connection
        const socket = createWebSocket(tab.id, term);
        
        term.onData((data) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(data);
          } else {
            // Store data to send when reconnected? Or just ignore
            console.log('Socket not open, cannot send data');
          }
        });

        socketInstances.current[tab.id] = socket;
        xtermInstances.current[tab.id] = term;
        fitAddons.current[tab.id] = fitAddon;
      }
    });

    // Cleanup disconnected tabs
    Object.keys(xtermInstances.current).forEach((id) => {
      if (!tabs.find((t) => t.id === id)) {
        if (socketInstances.current[id]) {
          socketInstances.current[id].close();
          delete socketInstances.current[id];
        }
        xtermInstances.current[id]?.dispose();
        delete xtermInstances.current[id];
        delete fitAddons.current[id];
        delete containerRefs.current[id];
        delete reconnectAttempts.current[id];
      }
    });
  }, [tabs]);

  useEffect(() => {
    if (fitAddons.current[activeTabId]) {
      setTimeout(() => fitAddons.current[activeTabId]?.fit(), 100);
    }
  }, [activeTabId, height]);

  const addTab = () => {
    const newId = Date.now().toString();
    const newTab = { id: newId, title: `Terminal ${tabs.length + 1}` };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (e: React.MouseEvent, idToClose: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;

    if (socketInstances.current[idToClose]) {
      socketInstances.current[idToClose].close();
      delete socketInstances.current[idToClose];
    }

    const newTabs = tabs.filter((t) => t.id !== idToClose);
    setTabs(newTabs);

    if (activeTabId === idToClose) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    setIsResizing(true);

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const deltaY = startY.current - e.clientY;
    const newHeight = Math.min(Math.max(startHeight.current + deltaY, 150), 800);
    setHeight(newHeight);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsResizing(false);

    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(socketInstances.current).forEach(socket => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close();
        }
      });
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div className="w-full flex flex-col bg-[#1a1a1a] rounded-none overflow-hidden shadow-xl z-50">
      {/* Tab Bar */}
      <div className="flex items-center bg-[#1a1a1a] border-b border-slate-800 px-2 pt-2 gap-1 overflow-x-auto select-none flex-shrink-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-none cursor-pointer transition-colors border-b-3 ${
                isActive
                  ? ' border-slate-700 text-slate-100'
                  : ' border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span>{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(e, tab.id)}
                  className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={addTab}
          className="p-1.5 mb-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          title="New Terminal"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Resize Handle - AT THE TOP */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ touchAction: 'none' }}
        className={`h-2 w-full bg-slate-950 flex items-center justify-center group cursor-ns-resize transition-all duration-200 border-b flex-shrink-0 ${
          isResizing
            ? 'border-sky-400 shadow-[0_2px_12px_rgba(56,189,248,0.6)]'
            : 'border-slate-800 hover:border-slate-600'
        }`}
      >
        <GripHorizontal
          className={`w-4 h-4 transition-colors duration-200 ${
            isResizing ? 'text-sky-400' : 'text-slate-600 group-hover:text-slate-300'
          }`}
        />
      </div>

      {/* Terminal Content */}
      <div className="relative w-full" style={{ height: `${height}px`, minHeight: '150px' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            ref={(el) => {
              containerRefs.current[tab.id] = el;
            }}
            className={`w-full h-full p-2 ${tab.id === activeTabId ? 'block' : 'hidden'}`}
          />
        ))}
      </div>
    </div>
  );
}