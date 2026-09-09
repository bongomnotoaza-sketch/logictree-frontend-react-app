import { BookOpen, ArrowLeft, type LucideIcon } from "lucide-react";

const FILTERS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All", icon: BookOpen },
  { key: "web-development-bootcamp", label: "Web Development Bootcamp", icon: BookOpen },
  { key: "data-science-mastery", label: "Data Science Mastery", icon: BookOpen },
  { key: "ui-ux-design-fundamentals", label: "UI/UX Design Fundamentals", icon: BookOpen },
  { key: "python-programming-pro", label: "Python Programming Pro", icon: BookOpen },
  { key: "machine-learning-a-z", label: "Machine Learning A-Z", icon: BookOpen },
  { key: "cloud-architecture", label: "Cloud Architecture", icon: BookOpen },
  { key: "business-analytics", label: "Business Analytics", icon: BookOpen },
  { key: "mobile-app-development", label: "Mobile App Development", icon: BookOpen },
];

export type CourseFilter = (typeof FILTERS)[number]["key"];

interface CourseSidebarProps {
  activeFilter: CourseFilter;
  onSelectFilter: (key: CourseFilter) => void;
  onBack: () => void;
  onAdd?: () => void;
}

export default function CourseSidebar({
  activeFilter,
  onSelectFilter,
  onBack,

}: CourseSidebarProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Courses</span>
        </button>
        
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        {FILTERS.map(({ key, label, icon: Icon }) => {
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
            </button>
          );
        })}
      </div>
    </div>
  );
}