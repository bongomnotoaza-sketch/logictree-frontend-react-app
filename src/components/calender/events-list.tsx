import EventCard from "./events-card";
import eventCards from "./events-card-data";

export default function EventsList() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 md:mr-auto md:ml-0 overflow-scroll">
      {eventCards.map((card, index) => (
        <EventCard
          key={index}
          event={card.event}
          description={card.description}
          datetoevent={card.datetoevent}
        />
      ))}
    </div>
  );
}