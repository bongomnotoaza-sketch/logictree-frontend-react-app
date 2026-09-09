import UpdateCard from "./updates-card";
import updateCards from "./updates-card-data";

export default function UpdatesList() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 md:mr-auto md:ml-0">
      {updateCards.map((card, index) => (
        <UpdateCard
          key={index}
          initials={card.initials}
          heading={card.heading}
          subject={card.subject}
          senddate={card.senddate}
        />
      ))}
    </div>
  );
}