import { useState } from "react";

import { createFolder } from "@/utils/create-folder";
import { createFile } from "@/utils/create-file";
import type { TreeNode } from "@/utils/file-tree-utils";

interface HeaderOptionsProps {
    tree: TreeNode;
    currentPath: string;
    onRefresh: () => void;
}

export default function HeaderOptions({
    tree,
    currentPath,
    onRefresh,
}: HeaderOptionsProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (menu: string) => {
        setOpenMenu((current) =>
            current === menu ? null : menu,
        );
    };

    const handleCreateFile = async () => {
        const result = await createFile(
            currentPath,
            tree,
        );

        setOpenMenu(null);

        if (result.success) {
            onRefresh();
        }
    };

    const handleCreateFolder = async () => {
        const success = await createFolder(
            currentPath,
            tree,
        );

        setOpenMenu(null);

        if (success) {
            onRefresh();
        }
    };

    return (
        <div className="relative flex w-full max-w-sm items-center gap-6">

            {/* File */}
            <div className="relative shrink-0">
                <button
                    type="button"
                    className="text-sm font-semibold text-white"
                    onClick={() => toggleMenu("file")}
                >
                    File
                </button>

                {openMenu === "file" && (
                    <div className="absolute left-0 top-full z-[100] mt-2 w-44 overflow-hidden rounded-md bg-[#1a1a1a] shadow-2xl">

                        <div
                            className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]"
                            onClick={handleCreateFile}
                        >
                            Create File
                        </div>

                        <div
                            className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]"
                            onClick={handleCreateFolder}
                        >
                            Create Folder
                        </div>

                        <div className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]">
                            Save
                        </div>

                        <div className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]">
                            Save As
                        </div>

                    </div>
                )}
            </div>

            {/* View */}
            <div className="relative shrink-0">
                <button
                    type="button"
                    className="text-sm font-semibold text-white"
                    onClick={() => toggleMenu("view")}
                >
                    View
                </button>

                {openMenu === "view" && (
                    <div className="absolute left-0 top-full z-[100] mt-2 w-36 overflow-hidden rounded-md bg-[#1a1a1a] shadow-2xl">
                        <div className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]">
                            New View
                        </div>
                    </div>
                )}
            </div>

            {/* Terminal */}
            <div className="relative shrink-0">
                <button
                    type="button"
                    className="text-sm font-semibold text-white"
                    onClick={() => toggleMenu("terminal")}
                >
                    Terminal
                </button>

                {openMenu === "terminal" && (
                    <div className="absolute left-0 top-full z-[100] mt-2 w-40 overflow-hidden rounded-md bg-[#1a1a1a] shadow-2xl">
                        <div className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]">
                            New Terminal
                        </div>
                    </div>
                )}
            </div>

            {/* Help */}
            <p className="shrink-0 text-sm font-semibold text-white">
                Help
            </p>

        </div>
    );
}