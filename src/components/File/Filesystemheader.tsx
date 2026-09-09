interface FileHeaderProps {
  onMenuClick: () => void;
  currentPath?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onHome?: () => void;
  onBack?: () => void;
  onForward?: () => void;
}

function formatDisplayPath(path: string): string {
  if (!path) return "Home";
  return `Home / ${path.split("\\").filter(Boolean).join(" / ")}`;
}

export default function FileHeader({
  onMenuClick,
  currentPath = "",
  canGoBack = false,
  canGoForward = false,
  onHome,
  onBack,
  onForward,
}: FileHeaderProps) {
  return (
    <div className="path-bar flex items-center gap-2 border-b border-gray-800 bg-[#1a1a1a] px-3 py-2 text-gray-100">
      {/* Home icon — far left */}
      <div
        className="nav-arrow flex h-7 w-7 cursor-pointer items-center justify-center rounded text-sm text-gray-300 hover:bg-white/10"
        id="homeButton"
        title="Home"
        onClick={onHome}
      >
        <i className="fas fa-home" />
      </div>

      {/* Sidebar toggle — mobile only, shown/hidden via Tailwind like the rest of the app */}
      <div className="nav-divider h-5 w-px bg-gray-700 md:hidden" />
      <button
        className="sidebar-collapse-toggle flex h-7 w-7 flex-col items-center justify-center gap-[3px] rounded hover:bg-white/10 md:hidden"
        id="sidebarToggleBtn"
        title="Toggle Sidebar"
        onClick={onMenuClick}
      >
        <span className="line block h-[2px] w-4 rounded bg-gray-300" />
        <span className="line block h-[2px] w-4 rounded bg-gray-300" />
        <span className="line block h-[2px] w-4 rounded bg-gray-300" />
      </button>

      <div className="nav-divider h-5 w-px bg-gray-700" />

      {/* Back / forward navigation */}
      <div className="nav-arrows flex items-center gap-1">
        <div
          className={`nav-arrow flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-white/10 ${
            canGoBack ? "cursor-pointer text-gray-300" : "cursor-not-allowed text-gray-600"
          }`}
          id="backButton"
          title="Go Back"
          onClick={canGoBack ? onBack : undefined}
        >
          <i className="fas fa-arrow-left" />
        </div>
        <div
          className={`nav-arrow flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-white/10 ${
            canGoForward ? "cursor-pointer text-gray-300" : "cursor-not-allowed text-gray-600"
          }`}
          id="forwardButton"
          title="Go Forward"
          onClick={canGoForward ? onForward : undefined}
        >
          <i className="fas fa-arrow-right" />
        </div>
      </div>

      <div className="nav-divider h-5 w-px bg-gray-700" />

      {/* Path display */}
      <div className="path-display flex items-center gap-1.5 text-sm text-gray-200">
        <i className="fas fa-location-arrow text-[#3a5a3a]" />
        <span id="currentPath">{formatDisplayPath(currentPath)}</span>
        <span
          style={{ marginLeft: 4, background: "transparent", border: "none", color: "#3a5a3a", padding: 0 }}
        >
          📁
        </span>
      </div>
    </div>
  );
}