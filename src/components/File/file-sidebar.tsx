import type { TreeNode } from "./file-tree-utils";
import WorkSpace from "./filesystworkspace";
import FileSearchBar from "./filesystsearch-bar";

interface FileSideBarProps {
  tree: TreeNode;
  onNavigate: (path: string) => void;
}

export default function FileSideBar({ tree, onNavigate }: FileSideBarProps) {
  return (
    <div className="w-full bg-[#1a1a1a] h-full grid grid-rows-[10%_90%]">
      <FileSearchBar tree={tree} onNavigate={onNavigate} />
      <WorkSpace />
    </div>
  );
}