import EventsList from "./events-list";
import { CalendarCard } from "./CalenderCard";

export default function CalenderBodyTop() {
  return (
    <div className="grid h-full w-full grid-cols-2 overflow-hidden">
      <div className="flex h-full w-full items-center justify-center">
        <CalendarCard />
      </div>
        <EventsList />
    </div>
  );
}