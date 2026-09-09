import type { TreeNode } from "@/utils/file-tree-utils";

export async function renameFile(
  fileName: string,
  filePath: string,
  tree: TreeNode,
): Promise<boolean> {
  const newName = prompt(
    `Rename "${fileName}" to:`,
    fileName,
  );

  if (newName === null) return false;

  const trimmedNewName = newName.trim();

  if (!trimmedNewName) {
    alert("File name cannot be empty");
    return false;
  }

  if (trimmedNewName === fileName) {
    alert("No change made");
    return false;
  }

  const normalizedPath = filePath
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

  const parts = normalizedPath
    .split("/")
    .filter(Boolean);

  parts.pop();

  const sourceDirPath = parts.join("/");

  let sourceNode: TreeNode = tree;

  if (sourceDirPath) {
    for (const part of sourceDirPath.split("/")) {
      const node = sourceNode[part];

      if (!node || node.type !== "folder") {
        alert("Error: Source folder not found");
        return false;
      }

      sourceNode = node.children;
    }
  }

  const fileNode = sourceNode[fileName];

  if (!fileNode || fileNode.type !== "file") {
    alert("Error: File not found");
    return false;
  }

  if (sourceNode[trimmedNewName]) {
    alert(
      `A file or folder named "${trimmedNewName}" already exists in this location`,
    );
    return false;
  }

  try {
    const response = await fetch(
      "/filesystem/files/rename/",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          path: 
          sourceDirPath
            ? `${sourceDirPath}/${fileName}`
            : `/${fileName}`,
          newName: trimmedNewName,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status}`,
      );
    }

    const result = await response.json();

    console.log(
      "[System] ✅ File renamed on server:",
      result,
    );
  } catch (error: unknown) {
    console.error(
      "[System] ❌ Failed to rename file on server:",
      error,
    );

    alert(
      "Failed to rename file on server.\n\n" +
        (error instanceof Error
          ? error.message
          : "Unknown error"),
    );

    return false;
  }

  delete sourceNode[fileName];

  sourceNode[trimmedNewName] = fileNode;

  console.log(
    `[System] ✅ File renamed from "${fileName}" to "${trimmedNewName}"`,
  );

  return true;
}