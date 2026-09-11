import {
  BookOpen,
  ArrowLeft,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type LessonItem = { key: string; id?: number; label: string; icon: LucideIcon };

const ALL_ITEM: LessonItem = { key: "all", label: "All", icon: BookOpen };

// Hardcoded module id for now — swap for a prop/context later
const MODULE_ID = 1;

export type LessonFilter = string;

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function getCSRFToken(): Promise<string | null> {
  try {
    const response = await fetch(`/auth/get-csrf-token/`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error(`CSRF endpoint returned ${response.status}`);
    const data = await response.json();
    if (!data.csrfToken || typeof data.csrfToken !== "string") {
      throw new Error("Server did not return a valid CSRF token");
    }
    return data.csrfToken;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return null;
  }
}

interface LessonSidebarProps {
  activeFilter: LessonFilter;
  onSelectFilter: (key: LessonFilter) => void;
  onBack: () => void;
  onActiveLabelChange?: (label: string) => void; // NEW
}

export default function LessonSidebar({
  activeFilter,
  onSelectFilter,
  onBack,
  onActiveLabelChange, // NEW
}: LessonSidebarProps) {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core fetch — no `cancelled` flag here so it always commits its result.
  // Callers decide whether to ignore it; the button/pull just wants fresh data.
  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/notes/lessons/?module_id=${MODULE_ID}`, {
        credentials: "include",
        // Prevent any intermediary/browser cache from returning stale data
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Failed to load lessons (${res.status})`);
      const data = await res.json();

      // API returns: [{ id, lesson_index, lesson_name }, ...]
      const raw = Array.isArray(data) ? data : data.results ?? [];

      // Sort by lesson_index to respect server-defined ordering
      const sorted = [...raw].sort(
        (a: any, b: any) => (a.lesson_index ?? 0) - (b.lesson_index ?? 0)
      );

      const mapped: LessonItem[] = sorted.map((l: any) => ({
        key: slugify(l.lesson_name) || String(l.id),
        id: l.id,
        label: l.lesson_name,
        icon: BookOpen,
      }));

      setLessons(mapped);
    } catch (e: any) {
      setError(e.message ?? "Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, []);

  // Pull on mount / page reload
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // NEW: report the active lesson's display name to the parent
  useEffect(() => {
    if (!onActiveLabelChange) return;
    if (activeFilter === "all") {
      onActiveLabelChange("All Lessons");
      return;
    }
    const found = lessons.find((l) => l.key === activeFilter);
    onActiveLabelChange(found?.label ?? "");
  }, [activeFilter, lessons, onActiveLabelChange]);

  // Move up/down locally (visual only — no server endpoint for reorder here)
  const moveItem = (key: LessonFilter, direction: "up" | "down") => {
    setLessons((prev) => {
      const index = prev.findIndex((f) => f.key === key);
      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  // Prompt for all required fields, then POST to server
  const handleAdd = async () => {
    const name = window.prompt("Enter lesson name:");
    if (!name) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const timeInput = window.prompt(
      "Enter lesson time in seconds (e.g. 300):",
      "300"
    );
    if (timeInput === null) return;
    const lessonTime = Number(timeInput);
    if (!Number.isFinite(lessonTime) || lessonTime < 0) {
      window.alert("Lesson time must be a non-negative number.");
      return;
    }

    const key = slugify(trimmedName);
    if (!key) return;

    if (lessons.some((l) => l.key === key)) {
      window.alert("A lesson with that name already exists.");
      return;
    }

    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
      window.alert("Could not obtain CSRF token. Please try again.");
      return;
    }

    try {
      const res = await fetch("/notes/lessons/create/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          moduleid: MODULE_ID,
          lesson_name: trimmedName,
          lesson_time: lessonTime,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          errBody?.detail ??
            JSON.stringify(errBody) ??
            `Failed to create lesson (${res.status})`
        );
      }

      const data = await res.json();

      // Optimistic add, then re-pull to guarantee server ordering/index
      setLessons((prev) => [
        ...prev,
        { key, id: data.id, label: trimmedName, icon: BookOpen },
      ]);
      fetchLessons();
    } catch (e: any) {
      window.alert(e.message ?? "Failed to create lesson");
    }
  };

  const handleDelete = (key: LessonFilter) => {
    // Local-only for now; wire up DELETE endpoint when available
    setLessons((prev) => prev.filter((l) => l.key !== key));
  };

  const filters: LessonItem[] = [ALL_ITEM, ...lessons];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Lessons</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Pull / refresh button */}
          <button
            onClick={fetchLessons}
            disabled={loading}
            className="text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
            aria-label="Pull lessons"
            title="Pull lessons"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>

          <button
            onClick={handleAdd}
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="Add lesson"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        {loading && (
          <p className="px-3 py-2 text-xs text-zinc-500">Loading lessons…</p>
        )}
        {error && <p className="px-3 py-2 text-xs text-red-400">{error}</p>}

        {filters.map(({ key, label, icon: Icon }) => {
          const isActive = activeFilter === key;
          const isAll = key === "all";
          return (
            <div
              key={key}
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
              <button
                onClick={() => onSelectFilter(key)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive
                      ? "text-emerald-500"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                  strokeWidth={2}
                />
                <span className="flex-1 font-medium">{label}</span>
              </button>

              {!isAll && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(key, "up")}
                    className={`transition-colors hover:text-white ${
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(key, "down")}
                    className={`transition-colors hover:text-white ${
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(key)}
                    className={`transition-colors hover:text-red-400 ${
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                    aria-label="Delete lesson"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}