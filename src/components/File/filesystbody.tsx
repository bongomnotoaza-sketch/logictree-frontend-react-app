import { useMemo, useState, useEffect } from "react";

import type { TreeNode } from "@/utils/file-tree-utils";

import {
  getNode,
  getFileIconClass,
} from "@/utils/file-tree-utils";

import { renameFolder } from "@/utils/renamefoder";
import { deleteFolder } from "@/utils/delete-folder";
import { moveFolder } from "@/utils/move-folder";
import { copyFolder } from "@/utils/copy-folder";
import { createFolder } from "@/utils/create-folder";

import { renameFile } from "@/utils/rename-file";
import { deleteFile } from "@/utils/delete-file";
import { moveFile } from "@/utils/move-file";
import { copyFile } from "@/utils/copy-file";

interface GridItem {
  key: string;
  type: "file" | "folder";
}

interface ContextMenuState {
  x: number;
  y: number;
  key: string;
  path: string;
  type: "file" | "folder";
}

interface DraggedItemState {
  key: string;
  path: string;
  type: "file" | "folder";
}

interface FilesystBodyProps {
  tree: TreeNode;
  loading: boolean;
  error: string | null;
  currentPath: string;
  onNavigate: (path: string) => void;
  onRefresh: () => void;
}

export default function FilesystBody({
  tree,
  loading,
  error,
  currentPath,
  onNavigate,
  onRefresh,
}: FilesystBodyProps) {
  const [contextMenu, setContextMenu] =
    useState<ContextMenuState | null>(null);

  const [draggedItem, setDraggedItem] =
    useState<DraggedItemState | null>(null);

  const [dragOverKey, setDragOverKey] =
    useState<string | null>(null);

  useEffect(() => {
    if (!contextMenu) return;

    const close = () => setContextMenu(null);

    window.addEventListener("click", close);

    return () =>
      window.removeEventListener("click", close);
  }, [contextMenu]);

  const node = useMemo(
    () => getNode(tree, currentPath),
    [tree, currentPath],
  );

  const items = useMemo<GridItem[]>(() => {
    if (!node) return [];

    const result: GridItem[] = [];

    Object.entries(node.children).forEach(
      ([key, child]) => {
        result.push({
          key,
          type: child.type,
        });
      },
    );

    result.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder")
        return -1;

      if (a.type !== "folder" && b.type === "folder")
        return 1;

      return a.key.localeCompare(b.key);
    });

    return result;
  }, [node]);

  const handleFolderClick = (key: string) => {
    const newPath = currentPath
      ? `${currentPath}\\${key}`
      : key;

    onNavigate(newPath);
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    key: string,
    type: "file" | "folder",
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const itemPath = currentPath
      ? `${currentPath}\\${key}`
      : key;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      key,
      path: itemPath,
      type,
    });
  };

  const handleBodyContextMenu = async (
  e: React.MouseEvent,
) => {
  e.preventDefault();

  const target = e.target as HTMLElement;

  if (target.closest(".grid-item")) return;

  const success = await createFolder(
    currentPath,
    tree,
  );

  if (success) {
    onRefresh();
  }
};

  // ============================================================
  // DRAG AND DROP (move via drag)
  // ============================================================

  const handleDragStart = (
    e: React.DragEvent,
    key: string,
    type: "file" | "folder",
  ) => {
    const path = currentPath
      ? `${currentPath}\\${key}`
      : key;

    setDraggedItem({ key, path, type });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverKey(null);
  };

  const handleDragOver = (
    e: React.DragEvent,
    targetKey: string,
  ) => {
    // required to allow a drop to fire on this element
    e.preventDefault();

    if (!draggedItem) return;

    // a folder can't be dropped into itself
    if (
      draggedItem.type === "folder" &&
      draggedItem.key === targetKey
    ) {
      return;
    }

    e.dataTransfer.dropEffect = "move";
    setDragOverKey(targetKey);
  };

  const handleDragLeave = (targetKey: string) => {
    setDragOverKey((prev) =>
      prev === targetKey ? null : prev,
    );
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetFolderKey: string,
  ) => {
    e.preventDefault();
    setDragOverKey(null);

    if (!draggedItem) return;

    // folder dropped onto itself: no-op
    if (
      draggedItem.type === "folder" &&
      draggedItem.key === targetFolderKey
    ) {
      setDraggedItem(null);
      return;
    }

    const destPath = currentPath
      ? `${currentPath}\\${targetFolderKey}`
      : targetFolderKey;

    // item dropped into the folder it's already in: no-op
    if (destPath === currentPath) {
      setDraggedItem(null);
      return;
    }

    const success =
      draggedItem.type === "folder"
        ? await moveFolder(
            draggedItem.key,
            draggedItem.path,
            destPath,
            tree,
          )
        : await moveFile(
            draggedItem.key,
            draggedItem.path,
            destPath,
            tree,
          );

    setDraggedItem(null);

    if (success) {
      onRefresh();
    }
  };

  // ============================================================
  // FOLDER ACTIONS
  // ============================================================

  const handleRenameFolder = async () => {
    if (!contextMenu) return;

    const success = await renameFolder(
      contextMenu.key,
      contextMenu.path,
      tree,
    );

    setContextMenu(null);

    if (success) {
      onRefresh();
    }
  };

  const handleDeleteFolder = async () => {
    if (!contextMenu) return;

    const success = await deleteFolder(
      contextMenu.key,
      contextMenu.path,
      tree,
    );

    setContextMenu(null);

    if (success) {
      onRefresh();
    }
  };

  const handleMoveFolder = async () => {
    if (!contextMenu) return;

    const destPath = prompt(
      "Enter destination folder path:",
    );

    if (destPath === null) return;

    const success = await moveFolder(
      contextMenu.key,
      contextMenu.path,
      destPath,
      tree,
    );

    setContextMenu(null);

    if (success) {
      onRefresh();
    }
  };

  const handleCopyFolder = async () => {
    if (!contextMenu) return;

    const destPath = prompt(
      "Enter destination folder path:",
    );

    if (destPath === null) return;

    const success = await copyFolder(
      contextMenu.key,
      contextMenu.path,
      destPath,
      tree,
    );

    setContextMenu(null);

    if (success) {
      onRefresh();
    }
  };

  // ============================================================
// FILE ACTIONS
// ============================================================

const handleRenameFile = async () => {
  if (!contextMenu) return;

  const success = await renameFile(
    contextMenu.key,
    contextMenu.path,
    tree,
  );

  setContextMenu(null);

  if (success) {
    onRefresh();
  }
};

const handleDeleteFile = async () => {
  if (!contextMenu) return;

  const success = await deleteFile(
    contextMenu.key,
    contextMenu.path,
    tree,
  );

  setContextMenu(null);

  if (success) {
    onRefresh();
  }
};

const handleMoveFile = async () => {
  if (!contextMenu) return;

  const destPath = prompt(
    "Enter destination folder path:",
  );

  if (destPath === null) return;

  const success = await moveFile(
    contextMenu.key,
    contextMenu.path,
    destPath,
    tree,
  );

  setContextMenu(null);

  if (success) {
    onRefresh();
  }
};

const handleCopyFile = async () => {
  if (!contextMenu) return;

  const destPath = prompt(
    "Enter destination folder path:",
  );

  if (destPath === null) return;

  const success = await copyFile(
    contextMenu.key,
    contextMenu.path,
    destPath,
    tree,
  );

  setContextMenu(null);

  if (success) {
    onRefresh();
  }
};

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#1a1a1a] text-gray-100"
          onContextMenu={handleBodyContextMenu}    
    >
      {loading && (
        <div className="px-3 py-2 text-xs text-gray-400">
          Loading…
        </div>
      )}

      {error && (
        <div className="mx-3 mt-2 rounded bg-red-900/30 px-2 py-1 text-xs text-red-300">
          {error}
        </div>
      )}

      <div
        id="gridContainer"
        className="grid flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3 overflow-y-auto p-4"
      >
        {!node ? (
          <div className="col-span-full flex items-center justify-center py-8 text-sm text-gray-500">
            📂 Path not found
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-8 text-sm text-gray-500">
            📂 This folder is empty
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.key}
              className={`grid-item flex cursor-pointer flex-col items-center gap-1 rounded p-2 text-center hover:bg-white/5 ${
                dragOverKey === item.key
                  ? "bg-blue-500/20 ring-1 ring-blue-400"
                  : ""
              } ${
                draggedItem?.key === item.key
                  ? "opacity-40"
                  : ""
              }`}
              title={
                item.type === "folder"
                  ? "Click to open, drag to move"
                  : "Drag to move"
              }
              draggable
              onDragStart={(e) =>
                handleDragStart(e, item.key, item.type)
              }
              onDragEnd={handleDragEnd}
              onDragOver={
                item.type === "folder"
                  ? (e) => handleDragOver(e, item.key)
                  : undefined
              }
              onDragLeave={
                item.type === "folder"
                  ? () => handleDragLeave(item.key)
                  : undefined
              }
              onDrop={
                item.type === "folder"
                  ? (e) => handleDrop(e, item.key)
                  : undefined
              }
              onClick={() =>
                item.type === "folder"
                  ? handleFolderClick(item.key)
                  : undefined
              }
              onContextMenu={(e) =>
                handleContextMenu(
                  e,
                  item.key,
                  item.type,
                )
              }
            >
              <div className="icon text-3xl">
                {item.type === "folder" ? (
                  "📁"
                ) : getFileIconClass(item.key) ? (
                  <i
                    className={`devicon ${getFileIconClass(
                      item.key,
                    )}`}
                  />
                ) : (
                  "📄"
                )}
              </div>

              <div className="label w-full truncate text-xs">
                {item.key}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================
          CONTEXT MENU
          ======================================================== */}

      {contextMenu && (
        <div
          className="fixed z-50 min-w-[170px] rounded border border-gray-700 bg-[#242424] py-1 shadow-lg"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-gray-700 px-3 py-2 text-xs text-gray-400">
            {contextMenu.key}
          </div>

          {contextMenu.type === "folder" ? (
            <>
              <button
                className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                onClick={() => {
                  onNavigate(contextMenu.path);
                  setContextMenu(null);
                }}
              >
                Open
              </button>

              <button
                className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                onClick={handleRenameFolder}
              >
                Rename
              </button>

              <button
                className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                onClick={handleMoveFolder}
              >
                Move
              </button>

              <button
                className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                onClick={handleCopyFolder}
              >
                Copy
              </button>

              <button
                className="block w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-white/10"
                onClick={handleDeleteFolder}
              >
                Delete
              </button>
            </>
          ) : (
            <>
                <button
                    className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                    onClick={() => setContextMenu(null)}
                >
                  Open
                </button>

                <button
                     className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                    onClick={handleRenameFile}
                >
                  Rename
                </button>

                <button
                     className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                     onClick={handleMoveFile}
                >
                  Move
                </button>

                <button
                     className="block w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-white/10"
                     onClick={handleCopyFile}
                >
                  Copy
                </button>

                <button
                     className="block w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-white/10"
                     onClick={handleDeleteFile}
                >
                  Delete
                </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}