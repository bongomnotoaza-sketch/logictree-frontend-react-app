import LessonCard from "./lesson-card";
import lessonCards from "./lesson-card-data";

export default function LessonList() {
  return (
    <div className="flex w-[95%] h-[95%] mx-auto my-auto flex-col gap-2 overflow-scroll bg-[#14532d] rounded-xl">
      {lessonCards.map((card, index) => (
        <LessonCard
          key={index}
          subject={card.subject}
          lessontime={card.lessontime}
        />
      ))}
    </div>
  );
}