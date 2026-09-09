export default function SidebarBodyTop() {
  return (
    <div className="h-[10%] shrink-0 border-b border-white/70 flex flex-col bg-[#161616] justify-end p-3">
      <div className="flex items-center justify-start">
        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_3px_rgba(34,197,94,0.7)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="ml-2 text-xxxlg font-semibold">
          <span className="text-white">Logic</span>
          <span className="text-green-500">Tree</span>
        </div>
      </div>
      <div className="text-xs text-white/50 mt-1">by Alikho Mnotoza</div>
    </div>
  );
}