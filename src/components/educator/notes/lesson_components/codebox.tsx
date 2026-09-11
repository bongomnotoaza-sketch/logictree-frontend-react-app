import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type * as Monaco from "monaco-editor";

interface CodeBoxProps {
  input: string;
  output?: string;
  /** ws://host:port of the WebSocket IDE server. Defaults to the page's host on :8765 */
  wsUrl?: string;
  /** language id to start selected on, must match one of LANGUAGES below */
  defaultLanguage?: string;
  onInputChange?: (value: string) => void;
  onLanguageChange?: (language: string) => void;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected";

// Single source of truth: server LANGUAGE_CONFIGS id + Monaco highlighting id + label
const LANGUAGES: { id: string; label: string; monaco: string }[] = [
  { id: "python", label: "Python", monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "java", label: "Java", monaco: "java" },
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "c", label: "C", monaco: "c" },
  { id: "csharp", label: "C#", monaco: "csharp" },
  { id: "go", label: "Go", monaco: "go" },
  { id: "rust", label: "Rust", monaco: "rust" },
];

function monacoLangFor(id: string) {
  return LANGUAGES.find((l) => l.id === id)?.monaco ?? "plaintext";
}

const STATUS_COLOR: Record<ConnectionStatus, string> = {
  connecting: "#eab308", // yellow
  connected: "#22c55e", // green
  disconnected: "#ef4444", // red
};

export default function CodeBox({
  input,
  output: initialOutput = "",
  wsUrl,
  defaultLanguage = "python",
  onInputChange,
  onLanguageChange,
}: CodeBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [ready, setReady] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [output, setOutput] = useState(initialOutput);
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState(defaultLanguage);

  const outputEndRef = useRef<HTMLDivElement | null>(null);
  const stdinInputRef = useRef<HTMLInputElement | null>(null);
  const [stdinValue, setStdinValue] = useState("");
  const [awaitingStdin, setAwaitingStdin] = useState(false);

  // --- Monaco loader (shared pattern) ---------------------------------
  useEffect(() => {
    if (window.monaco) {
      setReady(true);
      return;
    }

    const existing = document.getElementById("monaco-loader-script");
    const onLoaded = () => {
      if (!window.require) return;
      window.require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
        },
      });
      window.require(["vs/editor/editor.main"], () => {
        if (window.monaco) setReady(true);
      });
    };

    if (existing) {
      if (window.require) onLoaded();
      else existing.addEventListener("load", onLoaded);
      return;
    }

    const script = document.createElement("script");
    script.id = "monaco-loader-script";
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.js";
    script.async = true;
    script.onload = onLoaded;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || editorRef.current) return;
    const monaco = window.monaco;
    if (!monaco) return;

    monaco.editor.defineTheme("codebox-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#00000000" },
    });

    editorRef.current = monaco.editor.create(containerRef.current, {
      value: input,
      language: monacoLangFor(language),
      theme: "codebox-dark",
      automaticLayout: true,
      fontSize: 14,
      fontFamily:
        "'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 12 },
    });

    const disposable = editorRef.current.onDidChangeModelContent(() => {
      onInputChange?.(editorRef.current!.getValue());
    });

    return () => {
      disposable.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.getValue() !== input) editor.setValue(input);
  }, [input]);

  // Re-highlight when the selected language changes
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = window.monaco;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (model) monaco.editor.setModelLanguage(model, monacoLangFor(language));
  }, [language]);

  // Autoscroll output as it streams in
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ block: "end" });
  }, [output]);

  // --- WebSocket connection to the IDE server --------------------------
  useEffect(() => {
    const url = wsUrl ?? `ws://${window.location.hostname}:8765`;
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      setStatus("connecting");
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setStatus("connected");

      ws.onmessage = (event) => {
        let msg: any;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        switch (msg.type) {
          case "stdout":
          case "stderr":
          case "status":
            setOutput((prev) => prev + msg.data);
            break;
          case "stdin_request":
            setAwaitingStdin(true);
            // give the browser a tick to render the (now-enabled) input before focusing
            setTimeout(() => stdinInputRef.current?.focus(), 0);
            break;
          case "exit":
            setOutput((prev) => prev + `\n[process exited with code ${msg.exitCode}]\n`);
            setRunning(false);
            setAwaitingStdin(false);
            break;
          default:
            break;
        }
      };

      ws.onclose = () => {
        if (cancelled) return;
        setStatus("disconnected");
        setRunning(false);
        setAwaitingStdin(false);
        reconnectTimerRef.current = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [wsUrl]);

  function handleRun() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (running) return;

    const code = editorRef.current?.getValue() ?? input;
    setOutput("");
    setRunning(true);
    setAwaitingStdin(false);
    ws.send(JSON.stringify({ type: "run", code, language }));
  }

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setLanguage(next);
    onLanguageChange?.(next);
  }

  function sendStdin() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !running) return;
    if (stdinValue === "") return;

    ws.send(JSON.stringify({ type: "stdin", data: stdinValue }));
    // Server echoes the process's own stdout, but the process rarely echoes
    // back what came in over stdin, so echo it ourselves for visibility.
    setOutput((prev) => prev + stdinValue + "\n");
    setStdinValue("");
    setAwaitingStdin(false);
  }

  function handleStdinKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendStdin();
  }

  return (
    <div className="w-full max-w-[700px] min-h-[320px] sm:min-h-[420px] self-center rounded-xl overflow-hidden">
      <div className="w-full h-[210px] bg-[#1e1e1e] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 text-sm text-white shrink-0">
          <span>Input</span>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-[#2d2d2d] text-white rounded-md text-xs rounded px-2 py-1 border border-[#3c3c3c] outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleRun}
              disabled={status !== "connected" || running}
              className="flex items-center justify-center p-1 text-white hover:text-green-400 disabled:opacity-40 disabled:hover:text-white"
            >
              <Play size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-[#8c8c8c] text-sm">
              Loading editor…
            </div>
          )}
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>

      <div className="w-full h-[210px] bg-[#2d2d2d] flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-white shrink-0">
          <span>Output</span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: STATUS_COLOR[status] }}
            title={status}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 text-white whitespace-pre-wrap font-mono text-sm">
          {output}
          <div ref={outputEndRef} />
        </div>

        <div className="shrink-0 px-4 py-2 border-t border-[#3c3c3c]">
          <input
            ref={stdinInputRef}
            type="text"
            value={stdinValue}
            onChange={(e) => setStdinValue(e.target.value)}
            onKeyDown={handleStdinKeyDown}
            disabled={!running}
            placeholder={
              running
                ? awaitingStdin
                  ? "Program is waiting for input…"
                  : "Type input and press Enter"
                : "Run code to enable input"
            }
            className="w-full bg-[#1e1e1e] text-white text-sm font-mono rounded px-2 py-1 border border-[#3c3c3c] outline-none focus:border-[#3b9dff] disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}