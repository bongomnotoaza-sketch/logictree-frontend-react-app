import { useEffect, useMemo, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface OpenFile {
  id: string;
  name: string;
  value: string;
}

interface PreviewWindowProps {
  files: OpenFile[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function PreviewWindow({
  files,
  isFullscreen,
  onToggleFullscreen,
}: PreviewWindowProps) {
  const htmlFiles = useMemo(
    () => files.filter((f) => f.name.endsWith(".html")),
    [files]
  );
  const cssFiles = useMemo(
    () => files.filter((f) => f.name.endsWith(".css")),
    [files]
  );
  const jsFiles = useMemo(
    () => files.filter((f) => f.name.endsWith(".js")),
    [files]
  );

  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Keep the active preview tab valid as HTML files open/close in the editor
  useEffect(() => {
    if (htmlFiles.length === 0) {
      if (activeTab !== null) setActiveTab(null);
      return;
    }
    if (!activeTab || !htmlFiles.some((f) => f.name === activeTab)) {
      setActiveTab(htmlFiles[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlFiles]);

  // Build the combined document: active HTML + injected CSS/JS from other open tabs
  const srcDoc = useMemo(() => {
    if (!activeTab) return "";
    const active = htmlFiles.find((f) => f.name === activeTab);
    if (!active) return "";

    let html = active.value ?? "";

    cssFiles.forEach((css) => {
      const tag = `<style>\n/* Injected from ${css.name} */\n${css.value}\n</style>`;
      html = /<\/head>/i.test(html)
        ? html.replace(/<\/head>/i, `${tag}\n</head>`)
        : `${tag}\n${html}`;
    });

    jsFiles.forEach((js) => {
      const tag = `<script>\n/* Injected from ${js.name} */\n${js.value}\n<\/script>`;
      html = /<\/body>/i.test(html)
        ? html.replace(/<\/body>/i, `${tag}\n</body>`)
        : `${html}\n${tag}`;
    });

    return html;
  }, [activeTab, htmlFiles, cssFiles, jsFiles]);

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#0d0d0d]">
      {/* Tabs bar — one tab per open HTML file, plus fullscreen toggle */}
      {htmlFiles.length > 0 && (
        <div className="flex shrink-0 items-center gap-1 border-b border-[#2b2b2b] bg-[#1a1a1a] px-2">
          <div className="flex flex-1 items-stretch overflow-x-auto">
            {htmlFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setActiveTab(file.name)}
                className={`flex items-center gap-2 whitespace-nowrap border-r border-[#2b2b2b] px-3 py-2 text-xs ${
                  activeTab === file.name
                    ? "bg-[#232323] text-[#e8e8e8]"
                    : "text-[#8c8c8c] hover:bg-[#232323]"
                }`}
              >
                <span>🌐</span>
                <span className="max-w-[140px] truncate">{file.name}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className="shrink-0 rounded p-1.5 text-[#8c8c8c] hover:bg-[#2a2a2a] hover:text-white"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      )}

      {/* Preview surface */}
      <div className="relative min-h-0 flex-1">
        {htmlFiles.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#5a5a5a]">
            📄 No HTML files open
          </div>
        ) : (
          <iframe
            title="preview"
            srcDoc={srcDoc}
            className="h-full w-full border-0 bg-white"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          />
        )}
      </div>
    </div>
  );
}