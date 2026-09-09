import {
  Home,
  BookOpen,
  Bell,
  CalendarDays,
  
  Code2,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

const NAV_ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: "Home", icon: Home },
  { label: "Course", icon: BookOpen },
  { label: "Updates", icon: Bell },
  { label: "Calendar", icon: CalendarDays },
  
  { label: "IDE", icon: Code2 },
  { label: "Files", icon: FolderOpen },
];

export type NavItem = (typeof NAV_ITEMS)[number]["label"];

interface SidebarNavProps {
  active: string;
  onSelect: (label: string) => void;
}

export default function SidebarNav({ active, onSelect }: SidebarNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3">
      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const isActive = active === label;
          return (
            <li key={label}>
              <button
                onClick={() => onSelect(label)}
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
                <span className="font-medium">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}