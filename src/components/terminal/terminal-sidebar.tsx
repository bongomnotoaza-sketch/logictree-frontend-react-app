import TerminalNavicons from "./Terminal-Nav-icons";
import WorkSpace from "./worksapce";

interface SelectedFile {
  id: string;
  name: string;
  value: string;
}

interface TerminalSidebarProps {
  onSelect: (label: string) => void;
  selectedFile: SelectedFile | null;
  onSelectFile: (file: SelectedFile | null) => void;
}

export default function TerminalSidebar({
  onSelect,
  selectedFile,
  onSelectFile,
}: TerminalSidebarProps) {
  return (
    <div className="grid h-full w-full min-h-0 min-w-0 grid-cols-[20%_80%]">
      <TerminalNavicons
        onHomeClick={() => onSelect("Home")}
      />

      <WorkSpace
        selectedFile={selectedFile}
        onSelectFile={onSelectFile}
      />
    </div>
  );
}