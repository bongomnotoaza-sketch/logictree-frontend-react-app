import type { TreeNode } from "@/utils/file-tree-utils";

export async function idecreateFolder(
    targetPath: string,
    tree: TreeNode,
): Promise<boolean> {
    const folderName = prompt("Enter folder name:");

    if (folderName === null) {
        return false;
    }

    const trimmedName = folderName.trim();

    if (!trimmedName) {
        alert("Folder name cannot be empty");
        return false;
    }

    const normalizedPath = targetPath
        .replace(/\\/g, "/")
        .replace(/^\/+|\/+$/g, "");

    let parentNode: TreeNode = tree;

    if (normalizedPath) {
        for (const part of normalizedPath.split("/")) {
            const node = parentNode[part];

            if (!node || node.type !== "folder") {
                alert(
                    `Error: Workspace folder "${normalizedPath}" not found.`,
                );
                return false;
            }

            parentNode = node.children;
        }
    }

    if (parentNode[trimmedName]) {
        alert(
            `A file or folder named "${trimmedName}" already exists.`,
        );
        return false;
    }

    try {
        const response = await fetch(
            "/filesystem/folders/create/",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: trimmedName,
                    path: normalizedPath || "/",
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
            "[System] ✅ Folder created:",
            result,
        );
    } catch (error: unknown) {
        console.error(
            "[System] ❌ Failed to create folder:",
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

    return true;
}