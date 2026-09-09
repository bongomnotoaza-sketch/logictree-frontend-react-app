import type { TreeNode } from "./file-tree-utils";

export async function deleteFolder(
    folderName: string,
    folderPath: string,
    tree: TreeNode,
): Promise<boolean> {
    // ============================================================
    // 1. CONFIRM DELETION
    // ============================================================

    if (
        !confirm(
            `Delete folder "${folderName}" and all its contents?`,
        )
    ) {
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
    // 5. SERVER-SIDE DELETE
    // ============================================================

    try {
        const response = await fetch(
            "/filesystem/folders/delete/",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    path: parentPath
                        ? `${parentPath}/${folderName}`
                        : `/${folderName}`,
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
            "[System] ✅ Folder deleted on server:",
            result,
        );
    } catch (error: unknown) {
        console.error(
            "[System] ❌ Failed to delete folder on server:",
            error,
        );

        alert(
            "Failed to delete folder on server.\n\n" +
                (error instanceof Error
                    ? error.message
                    : "Unknown error"),
        );

        return false;
    }

    // ============================================================
    // 6. UPDATE LOCAL TREE
    // ============================================================

    delete parentNode[folderName];

    console.log(
        `[System] 🗑️ Folder "${folderName}" deleted successfully`,
    );

    return true;
}