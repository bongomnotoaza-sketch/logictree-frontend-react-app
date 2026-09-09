import AssignmentCard from "./assignment-card";
import assignmentCards from "./assignment-card-data";

export default function AssignmentList() {
  return (
    <div className="flex h-[95%] w-[95%] mx-auto my-auto max-w-2xl flex-col gap-2 overflow-scroll">
      {assignmentCards.map((card, index) => (
        <AssignmentCard
          key={index}
          subject={card.subject}
          taskdescription={card.taskdescription}
          duedate={card.duedate}
        />
      ))}
    </div>
  );
}