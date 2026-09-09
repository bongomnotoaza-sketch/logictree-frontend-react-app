import type { FC } from "react";

interface LessonCardProps {
  
  subject: string;
  lessontime: string;
}

const LessonCard: FC<LessonCardProps> = ({  subject,lessontime }) => {
  return (
    <div className="relative flex w-[90%] m-0 mx-auto items-center gap-3 rounded-none p-3 transition-all duration-300 ease-out hover:-translate-y-0.5">
      
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xl font-semibold text-white">{subject}</h3>
      </div>

      <span className="shrink-0 self-start text-l text-white">{lessontime}</span>
    </div>
  );
};

export default LessonCard;