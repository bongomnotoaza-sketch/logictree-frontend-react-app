import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SidebarFooter() {
  return (
    <>
      <Separator className="bg-zinc-800" />
      <div className="flex items-center gap-2.5 p-3">
        <Avatar className="h-8 w-8 border border-emerald-500/60">
          <AvatarFallback className="bg-zinc-900 text-xs font-medium text-white">
            AB
          </AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <div className="text-xs font-medium text-white">Alikho B.</div>
          <div className="text-[11px] text-zinc-500">Free plan</div>
        </div>
      </div>
    </>
  );
}