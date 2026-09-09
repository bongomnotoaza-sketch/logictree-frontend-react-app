import type { FC } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UpdateCardProps {
  initials: string;
  heading: string;
  subject: string;
  senddate: string;
}

const UpdateCard: FC<UpdateCardProps> = ({ initials, heading, subject, senddate }) => {
  return (
    <div className="relative flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-300 ease-out hover:-translate-y-0.5">
      <Avatar className="h-10 w-10 shrink-0 border border-emerald-500/60">
        <AvatarFallback className="bg-emerald-500/10 text-xs font-medium text-emerald-400">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-white">{heading}</h3>
        <p className="mt-0.5 truncate text-xs text-zinc-400">{subject}</p>
      </div>

      <span className="shrink-0 self-start text-[11px] text-zinc-500">{senddate}</span>
    </div>
  );
};

export default UpdateCard;