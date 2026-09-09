import type { TreeNode } from "./file-tree-utils";

export async function moveFolder(
    folderName: string,
    folderPath: string,
    destPath: string,
    tree: TreeNode,
): Promise<boolean> {
    // ============================================================
    // 1. VALIDATE DESTINATION
    // ============================================================

    const normalizedSourcePath = folderPath
        .replace(/\\/g, "/")
        .replace(/^\/+|\/+$/g, "");

    const normalizedDestPath = destPath
        .trim()
        .replace(/\\/g, "/")
        .replace(/^\/+|\/+$/g, "");

    if (!normalizedDestPath) {
        return false;
    }

    if (normalizedDestPath === normalizedSourcePath) {
        alert("Destination is the same as source");
        return false;
    }

    if (
        normalizedDestPath.startsWith(
            normalizedSourcePath + "/",
        )
    ) {
        alert("Cannot move a folder into itself");
        return false;
    }

    // ============================================================
    // 2. FIND SOURCE PARENT
    // ============================================================

    const sourceParts = normalizedSourcePath
        .split("/")
        .filter(Boolean);

    sourceParts.pop();

    const sourceParentPath = sourceParts.join("/");

    let sourceParentNode: TreeNode = tree;

    if (sourceParentPath) {
        for (const part of sourceParentPath.split("/")) {
            const node = sourceParentNode[part];

            if (!node || node.type !== "folder") {
                alert("Error: Source parent folder not found");
                return false;
            }

            sourceParentNode = node.children;
        }
    }

    // ============================================================
    // 3. CHECK SOURCE FOLDER
    // ============================================================

    const folderNode = sourceParentNode[folderName];

    if (!folderNode || folderNode.type !== "folder") {
        alert("Error: Source folder not found");
        return false;
    }

    // ============================================================
    // 4. FIND DESTINATION
    // ============================================================

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

    // ============================================================
    // 5. CHECK FOR EXISTING FOLDER
    // ============================================================

    if (destNode[folderName]) {
        if (
            !confirm(
                `A folder named "${folderName}" already exists at the destination. Overwrite?`,
            )
        ) {
            return false;
        }
    }

    // ============================================================
    // 6. SERVER-SIDE MOVE
    // ============================================================

    try {
        const response = await fetch(
            "/filesystem/folders/move/",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    path: 
                    sourceParentPath.replace(/\\/g, "/") +
                        "/" +
                        folderName,

                    newPath: destPath.replace(/\\/g, "/"),
                        
                    newName: folderName,
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
            "[System] ✅ Folder moved on server:",
            result,
        );
    } catch (error: unknown) {
        console.error(
            "[System] ❌ Failed to move folder on server:",
            error,
        );

        alert(
            "Failed to move folder on server.\n\n" +
                (error instanceof Error
                    ? error.message
                    : "Unknown error"),
        );

        return false;
    }

    // ============================================================
    // 7. UPDATE LOCAL TREE
    // ============================================================

    delete sourceParentNode[folderName];

    destNode[folderName] = folderNode;

    console.log(
        `[System] ✅ Folder "${folderName}" moved successfully to "${normalizedDestPath}"`,
    );

    return true;
}