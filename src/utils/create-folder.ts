import type { TreeNode } from "@/utils/file-tree-utils";

export async function createFolder(
  currentPath: string,
  tree: TreeNode,
): Promise<boolean> {
  const folderName = prompt("Enter folder name:");

  if (folderName === null) return false;

  const trimmedName = folderName.trim();

  if (!trimmedName) {
    alert("Folder name cannot be empty");
    return false;
  }

  const location = prompt(
    `Enter the path where you want to create this folder.\nExample: "Documents" or "Projects"\nType "current" to use: ${currentPath}`,
  );

  if (location === null) return false;

  const trimmedLocation = location.trim();

  if (!trimmedLocation) {
    alert("Location cannot be empty");
    return false;
  }

  let targetPath =
    trimmedLocation.toLowerCase() === "current"
      ? currentPath
      : trimmedLocation;

  if (!targetPath.startsWith("Home")) {
    targetPath = `Home\\${targetPath}`;
  }

  const parts = targetPath.split("\\").filter(Boolean);

  let parentNode: TreeNode = tree;

  for (const part of parts) {
    const node = parentNode[part];

    if (!node || node.type !== "folder") {
      alert(`Error: Location "${trimmedLocation}" not found.`);
      return false;
    }

    parentNode = node.children;
  }

  if (parentNode[trimmedName]) {
    alert("A folder with this name already exists in this location");
    return false;
  }

  try {
    const response = await fetch(
      "/filesystem/folders/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: trimmedName,
          path: targetPath.replace(/\\/g, "/"),
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const result = await response.json();

    console.log(
      "[System] ✅ Folder created on server:",
      result,
    );
  } catch (error: unknown) {
    console.error(
      "[System] ❌ Failed to create folder on server:",
      error,
    );

    alert(
      "Failed to create folder on server.\n\n" +
        (error instanceof Error
          ? error.message
          : "Unknown error"),
    );

    return false;
  }

  parentNode[trimmedName] = {
    type: "folder",
    children: {},
  };

  console.log(
    `[System] ✅ Folder "${trimmedName}" created successfully`,
  );

  return true;
}