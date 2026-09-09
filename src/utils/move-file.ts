import type { TreeNode } from "@/utils/file-tree-utils";

export async function moveFile(
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

  const fileNode = sourceNode[fileName];

  if (!fileNode || fileNode.type !== "file") {
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

  if (destNode[fileName]) {
    if (
      !confirm(
        `A file named "${fileName}" already exists at the destination. Overwrite?`,
      )
    ) {
      return false;
    }
  }

  try {
    const response = await fetch(
      "/filesystem/files/move/",
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
      "[System] ✅ File moved on server:",
      result,
    );
  } catch (error: unknown) {
    console.error(
      "[System] ❌ Failed to move file on server:",
      error,
    );

    alert(
      "Failed to move file on server.\n\n" +
        (error instanceof Error
          ? error.message
          : "Unknown error"),
    );

    return false;
  }

  delete sourceNode[fileName];

  destNode[fileName] = fileNode;

  alert(
    `✅ File "${fileName}" moved successfully to "${normalizedDestPath}"`,
  );

  return true;
}