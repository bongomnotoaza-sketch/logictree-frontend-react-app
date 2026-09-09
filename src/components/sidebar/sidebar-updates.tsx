import {
  List,
  Mail,
  Star,
  Megaphone,
  BookOpen,
  CalendarCheck,
  PencilLine,
  Server,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FILTERS: { key: string; label: string; icon: LucideIcon; count: number | null }[] = [
  { key: "all", label: "All", icon: List, count: null },
  { key: "unread", label: "Unread", icon: Mail, count: 12 },
  { key: "important", label: "Important", icon: Star, count: 3 },
  { key: "announcement", label: "Announcements", icon: Megaphone, count: 2 },
  { key: "course", label: "Course", icon: BookOpen, count: 5 },
  { key: "event", label: "Events", icon: CalendarCheck, count: 1 },
  { key: "assignment", label: "Assignments", icon: PencilLine, count: 4 },
  { key: "system", label: "System", icon: Server, count: null },
];

export type UpdatesFilter = (typeof FILTERS)[number]["key"];

interface SidebarUpdatesProps {
  activeFilter: UpdatesFilter;
  onSelectFilter: (key: UpdatesFilter) => void;
  onBack: () => void;
}

export default function SidebarUpdates({
  activeFilter,
  onSelectFilter,
  onBack,
}: SidebarUpdatesProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Updates</span>
      </button>

      <div className="flex flex-col gap-0.5 p-2">
        {FILTERS.map(({ key, label, icon: Icon, count }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => onSelectFilter(key)}
              className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors
                ${
                  isActive
                    ? "bg-emerald-500/10 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-emerald-500" />
              )}
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
                strokeWidth={2}
              />
              <span className="flex-1 text-left font-medium">{label}</span>
              {count !== null && (
                <Badge
                  variant="secondary"
                  className={`h-5 min-w-5 justify-center rounded-full px-1.5 text-[11px] ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-500"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}