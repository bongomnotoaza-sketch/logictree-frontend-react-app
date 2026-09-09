import { GitBranch } from "lucide-react";

export default function SidebarBrand() {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-zinc-800 px-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-zinc-950 shadow-[0_0_14px_2px_rgba(16,185,129,0.45)]">
        <GitBranch className="h-4.5 w-4.5" strokeWidth={2.25} />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">
          <span className="text-white">Logic</span>
          <span className="text-emerald-500">Tree</span>
        </div>
        <div className="text-[11px] text-zinc-500">by Alikho Mnotoza</div>
      </div>
    </div>
  );
}