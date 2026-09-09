import type { TreeNode } from "./file-tree-utils";

export async function renameFolder(
    folderName: string,
    folderPath: string,
    tree: TreeNode,
): Promise<boolean> {
    // ============================================================
    // 1. GET NEW FOLDER NAME
    // ============================================================

    const newName = prompt(
        `Rename folder "${folderName}" to:`,
        folderName,
    );

    if (newName === null) return false;

    const trimmedNewName = newName.trim();

    if (!trimmedNewName) {
        alert("Folder name cannot be empty");
        return false;
    }

    if (trimmedNewName === folderName) {
        alert("No change made");
        return false;
    }

    // ============================================================
    // 2. GET PARENT PATH
    // ============================================================

    const normalizedPath = folderPath
        .replace(/\\/g, "/")
        .replace(/^\/+|\/+$/g, "");

    const parts = normalizedPath.split("/").filter(Boolean);

    parts.pop();

    const parentPath = parts.join("/");

    // ============================================================
    // 3. FIND PARENT NODE
    // ============================================================

    let parentNode: TreeNode = tree;

    if (parentPath) {
        const parentParts = parentPath.split("/");

        for (const part of parentParts) {
            const node = parentNode[part];

            if (!node || node.type !== "folder") {
                alert("Error: Parent folder not found");
                return false;
            }

            parentNode = node.children;
        }
    }

    // ============================================================
    // 4. CHECK FOLDER EXISTS
    // ============================================================

    const folderNode = parentNode[folderName];

    if (!folderNode || folderNode.type !== "folder") {
        alert("Error: Folder not found");
        return false;
    }

    // ============================================================
    // 5. CHECK DUPLICATE NAME
    // ============================================================

    if (parentNode[trimmedNewName]) {
        alert(
            `A folder or file named "${trimmedNewName}" already exists in this location`,
        );
        return false;
    }

    // ============================================================
    // 6. SERVER-SIDE RENAME
    // ============================================================

    try {
        const response = await fetch(
            "/filesystem/folders/rename/",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    path: parentPath
                        ? `${parentPath}/${folderName}`
                        : `/${folderName}`,
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
            "[System] ✅ Folder renamed on server:",
            result,
        );
    } catch (error: unknown) {
        console.error(
            "[System] ❌ Failed to rename folder on server:",
            error,
        );

        alert(
            "Failed to rename folder on server.\n\n" +
                (error instanceof Error
                    ? error.message
                    : "Unknown error"),
        );

        return false;
    }

    // ============================================================
    // 7. UPDATE LOCAL TREE
    // ============================================================

    delete parentNode[folderName];

    parentNode[trimmedNewName] = folderNode;

    console.log(
        `[System] ✅ Folder renamed from "${folderName}" to "${trimmedNewName}"`,
    );

    return true;
}