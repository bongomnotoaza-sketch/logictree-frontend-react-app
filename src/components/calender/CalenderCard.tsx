import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  date: string;
  title: string;
  time?: string;
};

type CalendarView = "month" | "week" | "day";

type CalendarCardProps = {
  events?: CalendarEvent[];
};

const VIEWS: CalendarView[] = ["month", "week", "day"];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

function formatHour(h: number): string {
  const period = h < 12 ? "am" : "pm";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}${period}`;
}

// Always returns a complete 6-week (42-day) grid so every visible row is
// a full week — no month ever looks "cut off" partway through.
function getMonthGrid(anchor: Date): Date[] {
  const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

function getWeekDates(anchor: Date): Date[] {
  const start = addDays(anchor, -anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function CalendarCard({ events = [] }: CalendarCardProps) {
  const [anchor, setAnchor] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const today = useMemo(() => new Date(), []);

  const eventsForDate = (d: Date): CalendarEvent[] =>
    events.filter((e) => isSameDay(new Date(e.date), d));

  const monthGrid = useMemo(() => getMonthGrid(anchor), [anchor]);
  const weekDates = useMemo(() => getWeekDates(anchor), [anchor]);

  const goPrev = () => {
    if (view === "month") setAnchor((d) => addMonths(d, -1));
    else if (view === "week") setAnchor((d) => addDays(d, -7));
    else setAnchor((d) => addDays(d, -1));
  };

  const goNext = () => {
    if (view === "month") setAnchor((d) => addMonths(d, 1));
    else if (view === "week") setAnchor((d) => addDays(d, 7));
    else setAnchor((d) => addDays(d, 1));
  };

  const goToday = () => setAnchor(new Date());

  const headerLabel =
    view === "day"
      ? anchor.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
      : view === "week"
      ? `${weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekDates[6].toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
      : anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <Card className="flex h-[95%] w-[95%] mx-auto my-auto flex-col overflow-hidden border-zinc-800 bg-zinc-950 py-0 gap-0">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-zinc-800">
            <button
              onClick={goPrev}
              className="flex h-7 w-7 items-center justify-center text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            <button
              onClick={goNext}
              className="flex h-7 w-7 items-center justify-center text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
              aria-label="Next"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="text-[15px] font-semibold tracking-tight text-white">{headerLabel}</h2>
          <button
            onClick={goToday}
            className="rounded-md border border-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            Today
          </button>
        </div>

        <div className="flex gap-0.5 rounded-md bg-zinc-900 p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-[5px] px-2.5 py-1 text-[12px] font-medium capitalize text-zinc-500 transition-colors",
                view === v ? "bg-amber-400 text-zinc-950" : "hover:text-zinc-200"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex-1 overflow-y-auto p-0">
        {view === "month" && (
          <div className="flex h-full flex-col">
            <div className="grid grid-cols-7 border-b border-zinc-800/80">
              {WEEKDAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="px-2 py-2 text-center text-[11px] font-medium text-zinc-500"
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="grid flex-1 grid-cols-7 grid-rows-6">
              {monthGrid.map((d) => {
                const inMonth = d.getMonth() === anchor.getMonth();
                const isToday = isSameDay(d, today);
                const dayEvents = eventsForDate(d);
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => {
                      setAnchor(d);
                      setView("day");
                    }}
                    className={cn(
                      "flex flex-col items-start gap-1 border-b border-r border-zinc-800/50 p-1.5 text-left transition-colors hover:bg-zinc-900/60",
                      !inMonth && "bg-zinc-950/60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[13px]",
                        inMonth ? "text-zinc-200" : "text-zinc-700",
                        isToday && "bg-amber-400 font-semibold text-zinc-950"
                      )}
                    >
                      {d.getDate()}
                    </span>
                    <div className="flex w-full flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((e, i) => (
                        <span
                          key={i}
                          className="truncate rounded bg-amber-400/10 px-1 py-0.5 text-[10px] text-amber-300"
                        >
                          {e.title}
                        </span>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="px-1 text-[10px] text-zinc-500">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="grid h-full grid-cols-7">
            {weekDates.map((d) => {
              const isToday = isSameDay(d, today);
              const dayEvents = eventsForDate(d);
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => {
                    setAnchor(d);
                    setView("day");
                  }}
                  className="flex flex-col items-stretch gap-2 border-r border-zinc-800/50 p-2 text-left transition-colors last:border-r-0 hover:bg-zinc-900/60"
                >
                  <div className="flex flex-col items-center gap-1 border-b border-zinc-800/50 pb-2">
                    <span className="text-[11px] text-zinc-500">
                      {d.toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-[13px] text-zinc-200",
                        isToday && "bg-amber-400 font-semibold text-zinc-950"
                      )}
                    >
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {dayEvents.map((e, i) => (
                      <span
                        key={i}
                        className="truncate rounded bg-amber-400/10 px-1.5 py-1 text-[10px] text-amber-300"
                      >
                        {e.time ? `${e.time} · ` : ""}
                        {e.title}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {view === "day" && (
          <div className="flex flex-col">
            {HOURS.map((h) => {
              const hourEvents = eventsForDate(anchor).filter(
                (e) => e.time && parseInt(e.time.split(":")[0], 10) === h
              );
              return (
                <div key={h} className="flex min-h-[3rem] border-b border-zinc-800/50">
                  <span className="w-14 flex-shrink-0 border-r border-zinc-800/50 py-1.5 pr-2 text-right text-[11px] tabular-nums text-zinc-600">
                    {formatHour(h)}
                  </span>
                  <div className="flex flex-1 flex-col gap-1 p-1.5">
                    {hourEvents.map((e, i) => (
                      <div
                        key={i}
                        className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[12px] text-amber-200"
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}