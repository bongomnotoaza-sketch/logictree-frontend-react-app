import { useState } from "react";
import { Eye, TerminalSquare } from "lucide-react";
import MonacoEditor from "./monaco-editor";
import TerminalBody from "./xtermterminal";
import PreviewWindow from "./preview-window";

interface SelectedFile {
  id: string;
  name: string;
  value: string;
}

interface IdeBodyProps {
  selectedFile: SelectedFile | null;
}

type PanelView = "terminal" | "preview";

export default function IdeBody({ selectedFile }: IdeBodyProps) {
  // Mirrors MonacoEditor's open tabs (name + live content) so PreviewWindow
  // can build an HTML/CSS/JS preview without owning the editor state itself.
  const [openTabs, setOpenTabs] = useState<SelectedFile[]>([]);
  const [panelView, setPanelView] = useState<PanelView>("terminal");
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden">
      {/* Editor — kept mounted even when the preview goes fullscreen, so its
          open tabs/models aren't lost. Just visually hidden instead. */}
      <div
        className={`min-h-0 min-w-0 flex-1 overflow-hidden ${
          isPreviewFullscreen ? "hidden" : ""
        }`}
      >
        <MonacoEditor fileToOpen={selectedFile} onTabsChange={setOpenTabs} />
      </div>

      {/* Bottom panel: Terminal / Preview */}
      <div
        className={`flex min-h-0 w-full shrink-0 flex-col pointer-events-auto ${
          isPreviewFullscreen ? "h-full" : ""
        }`}
      >
        {/* View toggle */}
        <div className="flex shrink-0 items-center justify-end gap-1 border-b border-[#2b2b2b] bg-[#1a1a1a] px-2 py-1">
          <button
            type="button"
            onClick={() => setPanelView("terminal")}
            className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs ${
              panelView === "terminal"
                ? "bg-[#2a2a2a] text-white"
                : "text-[#8c8c8c] hover:bg-[#2a2a2a]"
            }`}
          >
            <TerminalSquare size={12} />
            Terminal
          </button>
          <button
            type="button"
            onClick={() => setPanelView("preview")}
            className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs ${
              panelView === "preview"
                ? "bg-[#2a2a2a] text-white"
                : "text-[#8c8c8c] hover:bg-[#2a2a2a]"
            }`}
          >
            <Eye size={12} />
            Preview
          </button>
        </div>

        <div className="min-h-0 flex-1">
          {panelView === "terminal" ? (
            <TerminalBody />
          ) : (
            <PreviewWindow
              files={openTabs}
              isFullscreen={isPreviewFullscreen}
              onToggleFullscreen={() => setIsPreviewFullscreen((v) => !v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}