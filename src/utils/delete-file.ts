import type { TreeNode } from "@/utils/file-tree-utils";

export async function deleteFile(
  fileName: string,
  sourcePath: string,
  tree: TreeNode,
): Promise<boolean> {
  if (
    !confirm(
      `Delete file "${fileName}"?`,
    )
  ) {
    return false;
  }

  const normalizedPath = sourcePath
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
    alert("Error: File not found in source location");
    return false;
  }

  try {
    const response = await fetch(
      "/filesystem/files/delete/",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          path: sourceDirPath
            ? `${sourceDirPath}/${fileName}`
            : `/${fileName}`,
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
      "[System] ✅ File deleted on server:",
      result,
    );
  } catch (error: unknown) {
    console.error(
      "[System] ❌ Failed to delete file on server:",
      error,
    );

    alert(
      "Failed to delete file on server.\n\n" +
        (error instanceof Error
          ? error.message
          : "Unknown error"),
    );

    return false;
  }

  delete sourceNode[fileName];

  console.log(
    `[System] 🗑️ File "${fileName}" deleted successfully`,
  );

  return true;
}