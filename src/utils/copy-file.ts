import type { TreeNode } from "@/utils/file-tree-utils";

export async function copyFile(
  fileName: string,
  sourcePath: string,
  destPath: string,
  tree: TreeNode,
): Promise<boolean> {
  const normalizedSourcePath = sourcePath
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

  const normalizedDestPath = destPath
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

  const sourceParts = normalizedSourcePath
    .split("/")
    .filter(Boolean);

  sourceParts.pop();

  const sourceDirPath = sourceParts.join("/");

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

  const sourceFile = sourceNode[fileName];

  if (!sourceFile || sourceFile.type !== "file") {
    alert("Error: File not found in source location");
    return false;
  }

  let destNode: TreeNode = tree;

  if (normalizedDestPath) {
    for (const part of normalizedDestPath.split("/")) {
      const node = destNode[part];

      if (!node || node.type !== "folder") {
        alert("Error: Destination folder not found");
        return false;
      }

      destNode = node.children;
    }
  }

  let targetName = fileName;

  if (destNode[fileName]) {
    const newName = prompt(
      `A file named "${fileName}" already exists.\nEnter a new name:`,
    );

    if (newName === null) return false;

    const trimmedNewName = newName.trim();

    if (!trimmedNewName) {
      alert("Name cannot be empty");
      return false;
    }

    if (destNode[trimmedNewName]) {
      alert(
        `A file or folder named "${trimmedNewName}" already exists at the destination`,
      );
      return false;
    }

    targetName = trimmedNewName;
  }

  try {
    const response = await fetch(
      "/filesystem/files/copy/",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          path: 
          sourceDirPath.replace(/\\/g, "/") +
          "/" +
          fileName,
          newPath: destPath.replace(/\\/g, "/"),
          newName: targetName,
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
      "[System] ✅ File copied on server:",
      result,
    );
  } catch (error: unknown) {
    console.error(
      "[System] ❌ Failed to copy file on server:",
      error,
    );

    alert(
      "Failed to copy file on server.\n\n" +
        (error instanceof Error
          ? error.message
          : "Unknown error"),
    );

    return false;
  }

  destNode[targetName] = {
    ...sourceFile,
  };

  if (targetName === fileName) {
    alert(
      `✅ File "${fileName}" copied successfully to "${normalizedDestPath}"`,
    );
  } else {
    alert(
      `✅ File "${fileName}" copied as "${targetName}" to "${normalizedDestPath}"`,
    );
  }

  return true;
}