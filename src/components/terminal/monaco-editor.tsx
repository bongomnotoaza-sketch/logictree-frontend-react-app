import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const LANG_META = {
  js: { label: "JS", color: "#f0db4f", lang: "javascript" },
  ts: { label: "TS", color: "#3178c6", lang: "typescript" },
  jsx: { label: "JSX", color: "#61dafb", lang: "javascript" },
  tsx: { label: "TSX", color: "#61dafb", lang: "typescript" },
  py: { label: "PY", color: "#3776ab", lang: "python" },
  json: { label: "{}", color: "#cbcb41", lang: "json" },
  html: { label: "<>", color: "#e34c26", lang: "html" },
  css: { label: "#", color: "#563d7c", lang: "css" },
  md: { label: "MD", color: "#8e8e8e", lang: "markdown" },
};

function getMeta(filename) {
  const ext = filename.split(".").pop();
  return LANG_META[ext] || { label: "•", color: "#888888", lang: "plaintext" };
}

const DEFAULT_FILE = {
  id: "index-js",
  name: "index.js",
  value: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("world"));
`,
};

// fileToOpen: { id, name, value } | null
// id should be stable/unique per file (e.g. its full path) so re-selecting
// the same file focuses the existing tab instead of duplicating it.
//
// onTabsChange: optional callback, fired whenever the set of open tabs
// changes AND whenever the content of the active model changes (live typing),
// so a parent (e.g. IdeBody -> PreviewWindow) can mirror { id, name, value }.
export default function MonacoEditor({ fileToOpen = null, onTabsChange }) {
  const [tabs, setTabs] = useState([DEFAULT_FILE]);
  const [activeId, setActiveId] = useState(DEFAULT_FILE.id);

  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const modelsRef = useRef({});
  const listenersRef = useRef({}); // id -> IDisposable from onDidChangeContent
  const [ready, setReady] = useState(false);

  // Load Monaco from CDN once
  useEffect(() => {
    if (window.monaco) {
      monacoRef.current = window.monaco;
      setReady(true);
      return;
    }

    const existing = document.getElementById("monaco-loader-script");
    const onLoaded = () => {
      window.require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
        },
      });
      window.require(["vs/editor/editor.main"], () => {
        monacoRef.current = window.monaco;
        setReady(true);
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

  // Notify the parent whenever the open-tabs list (names/content) changes
  useEffect(() => {
    onTabsChange?.(tabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  // Attach a content-change listener to a model exactly once, so live edits
  // flow back into `tabs` state (and therefore up to the parent).
  function watchModel(id, model) {
    if (listenersRef.current[id]) return;
    const disposable = model.onDidChangeContent(() => {
      const newValue = model.getValue();
      setTabs((prev) =>
        prev.map((t) => (t.id === id ? { ...t, value: newValue } : t))
      );
    });
    listenersRef.current[id] = disposable;
  }

  // Create editor instance once Monaco is ready
  useEffect(() => {
    if (!ready || !containerRef.current || editorRef.current) return;
    const monaco = monacoRef.current;

    monaco.editor.defineTheme("tab-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000",
      },
    });

    const active = tabs.find((t) => t.id === activeId) || tabs[0];
    const model = monaco.editor.createModel(
      active.value,
      getMeta(active.name).lang
    );
    modelsRef.current[active.id] = model;
    watchModel(active.id, model);

    editorRef.current = monaco.editor.create(containerRef.current, {
      model,
      theme: "tab-dark",
      automaticLayout: true,
      fontSize: 16,
      fontFamily:
        "'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 12 },
    });

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
      Object.values(listenersRef.current).forEach((d) => d.dispose());
      listenersRef.current = {};
      Object.values(modelsRef.current).forEach((m) => m.dispose());
      modelsRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Switch model when active tab changes
  useEffect(() => {
    if (!ready || !editorRef.current) return;

    const monaco = monacoRef.current;
    const tab = tabs.find((t) => t.id === activeId);
    if (!tab) return;

    let model = modelsRef.current[tab.id];

    if (!model) {
      model = monaco.editor.createModel(tab.value, getMeta(tab.name).lang);
      modelsRef.current[tab.id] = model;
    }
    watchModel(tab.id, model);

    editorRef.current.setModel(model);
    editorRef.current.focus();
  }, [activeId, tabs, ready]);

  // Open (or focus) the tab for whatever file the parent hands us
  useEffect(() => {
    if (!fileToOpen) return;

    setTabs((prev) => {
      if (prev.some((t) => t.id === fileToOpen.id)) return prev;
      return [
        ...prev,
        { id: fileToOpen.id, name: fileToOpen.name, value: fileToOpen.value },
      ];
    });
    setActiveId(fileToOpen.id);
  }, [fileToOpen]);

  function closeTab(id, e) {
    e.stopPropagation();
    const idx = tabs.findIndex((t) => t.id === id);
    if (idx === -1) return;

    listenersRef.current[id]?.dispose();
    delete listenersRef.current[id];

    const model = modelsRef.current[id];
    if (model) {
      model.dispose();
      delete modelsRef.current[id];
    }

    const next = tabs.filter((t) => t.id !== id);
    setTabs(next);

    if (activeId === id && next.length > 0) {
      const newActive = next[Math.max(0, idx - 1)];
      setActiveId(newActive.id);
    }
  }

  return (
    <div className="flex flex-col h-full w-full rounded-none overflow-hidden pointer-events-none">
      {/* Tab bar - needs to receive clicks */}
      <div className="flex items-stretch bg-[#1a1a1a] border-b border-[#2b2b2b] overflow-x-auto flex-shrink-0 pointer-events-auto">
        {tabs.map((tab) => {
          const meta = getMeta(tab.name);
          const isActive = tab.id === activeId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`group flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none border-r border-[#2b2b2b] min-w-[120px] ${
                isActive
                  ? " text-[#e8e8e8]"
                  : " text-[#8c8c8c] hover:bg-[#2a2a2a]"
              }`}
              style={{
                borderTop: isActive
                  ? "2px solid #3b9dff"
                  : "2px solid transparent",
              }}
            >
              <span
                className="flex items-center justify-center rounded text-[9px] font-bold w-4 h-4 shrink-0"
                style={{
                  backgroundColor: `${meta.color}26`,
                  color: meta.color,
                }}
              >
                {meta.label}
              </span>
              <span className="truncate flex-1">{tab.name}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:bg-[#3c3c3c] rounded p-0.5 shrink-0 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Editor - clicks pass through to parent, but editor itself should be interactive */}
      <div className="flex-1 min-h-0 relative overflow-hidden pointer-events-none">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-[#8c8c8c] text-sm pointer-events-auto">
            Loading editor…
          </div>
        )}
        {tabs.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-[#5a5a5a] text-sm pointer-events-auto">
            No file open
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full pointer-events-auto" />
        )}
      </div>
    </div>
  );
}