import type { TreeNode } from "./file-tree-utils";

export async function copyFolder(
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

    if (
        normalizedDestPath.startsWith(
            normalizedSourcePath + "/",
        )
    ) {
        alert("Cannot copy a folder into itself");
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

    const sourceData = sourceParentNode[folderName];

    if (!sourceData || sourceData.type !== "folder") {
        alert("Error: Source folder not found");
        return false;
    }

    // ============================================================
    // 4. FIND DESTINATION
    // ============================================================

    let destNode: TreeNode = tree;

    for (const part of normalizedDestPath.split("/")) {
        const node = destNode[part];

        if (!node || node.type !== "folder") {
            alert("Error: Destination folder not found");
            return false;
        }

        destNode = node.children;
    }

    // ============================================================
    // 5. DETERMINE TARGET NAME
    // ============================================================

    let targetName = folderName;

    if (destNode[folderName]) {
        const newName = prompt(
            `A folder named "${folderName}" already exists.\nEnter a new name:`,
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

    // ============================================================
    // 6. SERVER-SIDE COPY
    // ============================================================

    try {
        const response = await fetch(
            "/filesystem/folders/copy/",
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
            "[System] ✅ Folder copied on server:",
            result,
        );
    } catch (error: unknown) {
        console.error(
            "[System] ❌ Failed to copy folder on server:",
            error,
        );

        alert(
            "Failed to copy folder on server.\n\n" +
                (error instanceof Error
                    ? error.message
                    : "Unknown error"),
        );

        return false;
    }

    // ============================================================
    // 7. UPDATE LOCAL TREE
    // ============================================================

    const copyData = JSON.parse(
        JSON.stringify(sourceData),
    );

    destNode[targetName] = copyData;

    const message =
        targetName === folderName
            ? `✅ Folder "${folderName}" copied successfully to "${normalizedDestPath}"`
            : `✅ Folder "${folderName}" copied as "${targetName}" to "${normalizedDestPath}"`;

    alert(message);

    return true;
}