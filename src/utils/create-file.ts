import type { TreeNode } from "@/utils/file-tree-utils";

export async function createFile(
  currentPath: string,
  tree: TreeNode,
): Promise<{ success: boolean; path?: string; name?: string }> {
  // ============================================================
  // 1. GET FILE NAME
  // ============================================================

  const fileName = prompt(
    "Enter file name (including extension, e.g., script.py):",
  );

  if (fileName === null) {
    return { success: false };
  }

  const trimmedName = fileName.trim();

  if (!trimmedName) {
    alert("File name cannot be empty");
    return { success: false };
  }

  if (!trimmedName.includes(".")) {
    alert(
      "Please include a file extension (e.g., .py, .js, .html)",
    );
    return { success: false };
  }

  // ============================================================
  // 2. GET LOCATION
  // ============================================================

  const location = prompt(
    `Enter the path where you want to create this file.\nExample: "src" or "public"\nType "current" to use current location: ${currentPath}`,
  );

  if (location === null) {
    return { success: false };
  }

  const trimmedLocation = location.trim();

  if (!trimmedLocation) {
    alert("Location cannot be empty");
    return { success: false };
  }

  // ============================================================
  // 3. BUILD TARGET PATH
  // ============================================================

  let targetPath =
    trimmedLocation.toLowerCase() === "current"
      ? currentPath
      : trimmedLocation;

  targetPath = targetPath
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

  // ============================================================
  // 4. FIND TARGET FOLDER
  // ============================================================

  let parentNode: TreeNode = tree;

  if (targetPath) {
    const parts = targetPath.split("/").filter(Boolean);

    for (const part of parts) {
      const node = parentNode[part];

      if (!node || node.type !== "folder") {
        alert(
          `Error: Location "${trimmedLocation}" not found.`,
        );
        return { success: false };
      }

      parentNode = node.children;
    }
  }

  // ============================================================
  // 5. CHECK FOR DUPLICATE
  // ============================================================

  if (parentNode[trimmedName]) {
    alert(
      "A file or folder with this name already exists in this location",
    );
    return { success: false };
  }

  const fullPath = targetPath
    ? `${targetPath}/${trimmedName}`
    : trimmedName;

  // ============================================================
  // 6. SERVER-SIDE CREATION
  // ============================================================

  try {
    const response = await fetch(
      "/filesystem/files/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: trimmedName,
          path: targetPath ? targetPath.replace(/\\/g, "/") : "/",
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
      "[System] ✅ File created on server:",
      result,
    );
  } catch (error: unknown) {
    console.error(
      "[System] ❌ Failed to create file on server:",
      error,
    );

    alert(
      "Failed to create file on server.\n\n" +
        (error instanceof Error
          ? error.message
          : "Unknown error"),
    );

    return { success: false };
  }

  // ============================================================
  // 7. UPDATE LOCAL TREE
  // ============================================================

  const defaultContent =
    `# ${trimmedName}\n` +
    `// New file created on ${new Date().toLocaleString()}\n` +
    `// Add your content here.`;

  parentNode[trimmedName] = {
    type: "file",
    content: defaultContent,
    size: defaultContent.length,
  };

  console.log(
    `[System] ✅ File "${trimmedName}" created successfully`,
  );

  return {
    success: true,
    path: fullPath,
    name: trimmedName,
  };
}