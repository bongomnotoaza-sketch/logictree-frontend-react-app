interface TerminalNavIconsProps {
  onHomeClick: () => void;
}

export default function TerminalNavicons({ onHomeClick }: TerminalNavIconsProps) {
  return (
    <div className="w-full h-full flex flex-col items-center bg-[#0d0d0d] border-r border-white">
      <div className="flex flex-col items-center justify-center gap-5 mt-[10%]">
        <div onClick={onHomeClick} className="cursor-pointer">
          <span className="fa-solid fa-house text-2xl text-transparent [-webkit-text-stroke:1px_white]"></span>
        </div>

        <div>
          <span className="fa-solid fa-file text-2xl text-transparent [-webkit-text-stroke:1px_white]"></span>
        </div>

        <div>
          <span className="fa-solid fa-magnifying-glass text-2xl text-transparent [-webkit-text-stroke:1px_white]"></span>
        </div>

        <div>
          <span className="fa-solid fa-play text-2xl text-transparent [-webkit-text-stroke:1px_white]"></span>
        </div>
      </div>
    </div>
  );
}