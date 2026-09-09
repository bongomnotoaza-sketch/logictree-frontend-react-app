import type { TreeNode } from "./file-tree-utils";

export interface OpenFile {
  path?: string;
}

export async function newFile(
  tree: TreeNode,
  openFiles: OpenFile[] = [],
  activeTabIndex: number = 0
): Promise<void> {
  // ============================================================
  // 1. GET FILE NAME
  // ============================================================

  const fileName = prompt(
    "Enter file name (including extension, e.g., script.py):"
  );

  if (fileName === null) return;

  const trimmedName = fileName.trim();

  if (!trimmedName) {
    alert("File name cannot be empty");
    return;
  }

  if (!trimmedName.includes(".")) {
    alert(
      "Please include a file extension (e.g., .py, .js, .html)"
    );
    return;
  }

  // ============================================================
  // 2. GET LOCATION
  // ============================================================

  const location = prompt(
    'Enter the path where you want to create this file.\nExample: "src" or "public"\nType "current" to use current location'
  );

  if (location === null) return;

  const trimmedLocation = location.trim();

  if (!trimmedLocation) {
    alert("Location cannot be empty");
    return;
  }

  // ============================================================
  // 3. BUILD TARGET PATH
  // ============================================================

  let targetPath = "";

  if (trimmedLocation.toLowerCase() === "current") {
    const currentFile = openFiles[activeTabIndex];

    if (currentFile?.path) {
      const pathParts = currentFile.path.split("/");
      pathParts.pop();
      targetPath = pathParts.join("/");
    }
  } else {
    // ✅ Fixed: Properly escaped regex
    targetPath = trimmedLocation.replace(/^\/+|\/+$/g, "");
  }

  // ============================================================
  // 4. CHECK IF LOCATION EXISTS
  // ============================================================

  let folderExists = false;
  let availableLocations: string[] = [];

  if (targetPath === "") {
    // Root always exists
    folderExists = true;
  } else {
    const filePaths = getFilePaths(tree);

    // Check whether files exist inside this folder
    for (const path of filePaths) {
      if (path.startsWith(`${targetPath}/`)) {
        folderExists = true;
        break;
      }
    }

    // Build available folder paths
    const allPaths = new Set<string>();

    for (const path of filePaths) {
      const parts = path.split("/");

      if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
          allPaths.add(parts.slice(0, i).join("/"));
        }
      }
    }

    availableLocations = Array.from(allPaths);
  }

  if (!folderExists) {
    const locationsStr =
      availableLocations.length > 0
        ? availableLocations.join(", ")
        : "Root only (leave empty)";

    alert(
      `Error: Location "${trimmedLocation}" not found.\n\nAvailable locations:\n${locationsStr}`
    );

    return;
  }

  // ============================================================
  // 5. CHECK FOR DUPLICATE
  // ============================================================

  const fullPath = targetPath
    ? `${targetPath}/${trimmedName}`
    : trimmedName;

  const filePaths = getFilePaths(tree);

  if (filePaths.includes(fullPath)) {
    alert(
      "A file with this name already exists in this location"
    );
    return;
  }

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
          path: targetPath || "/",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status}`
      );
    }

    const result = await response.json();

    console.log(
      "[System] ✅ File created on server:",
      result
    );
  } catch (error) {
    console.error(
      "[System] ❌ Failed to create file on server:",
      error
    );

    alert(
      "Failed to create file on server.\n\n" +
        (error instanceof Error
          ? error.message
          : "Unknown error")
    );

    return;
  }
}

// ============================================================
// HELPER — GET ALL FILE PATHS FROM TREE
// ============================================================

function getFilePaths(
  node: TreeNode,
  currentPath: string = ""
): string[] {
  const paths: string[] = [];

  for (const [name, child] of Object.entries(node)) {
    const path = currentPath
      ? `${currentPath}/${name}`
      : name;

    if (child.type === "file") {
      paths.push(path);
    } else if (child.type === "folder") {
      paths.push(
        ...getFilePaths(child.children, path)
      );
    }
  }

  return paths;
}