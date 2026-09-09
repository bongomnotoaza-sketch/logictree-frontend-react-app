import type { FC } from "react";

interface AssignmentCardProps {
  
  subject: string;
  taskdescription: string;
  duedate: string;
}

const AssignmentCard: FC<AssignmentCardProps> = ({  subject, taskdescription, duedate }) => {
  return (
    <div className="relative flex w-full m-0 items-center gap-3 rounded-md bg-[#2d2d2d] p-3 transition-all duration-300 ease-out hover:-translate-y-0.5">
      
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-white">{subject}</h3>
        <p className="mt-0.5 truncate text-xs text-zinc-400">{taskdescription}</p>
      </div>

      <span className="shrink-0 self-start text-[11px] text-zinc-500">{duedate}</span>
    </div>
  );
};

export default AssignmentCard;