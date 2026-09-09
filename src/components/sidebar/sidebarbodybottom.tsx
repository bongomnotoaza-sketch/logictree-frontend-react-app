const toggleOptions = ['Home', 'course', 'Updates', 'Calender', 'Notes', 'IDE', 'Files'] as const;

type ToggleOption = typeof toggleOptions[number];

const icons: Record<ToggleOption, string> = {
  Home: 'fa-house',
  course: 'fa-book-open',
  Updates: 'fa-bell',
  Calender: 'fa-calendar-days',
  Notes: 'fa-note-sticky',
  IDE: 'fa-code',
  Files: 'fa-folder-open'
};

export default function SidebarBodyBottom() {
  return (
    <div className="flex flex-col gap-1 p-2 overflow-y-auto flex-1 border-r border-white/70">
      {toggleOptions.map((option) => (
        <div
          key={option}
          className="w-full h-12 md:h-14 grid grid-cols-[20%_80%] overflow-hidden
            transition-transform duration-300 ease-out hover:translate-x-2"
        >
          <div className="flex items-center justify-center text-white font-sans">
            <span className={`fa-solid ${icons[option]} text-transparent [-webkit-text-stroke:1px_#22c55e] drop-shadow-[0_0_6px_rgba(34,197,94,0.9)]`}/>
          </div>
          <div className="flex items-center justify-start text-white font-medium font-sans">
            {option}
          </div>
         
        </div>
      ))}
    </div>
  );
}