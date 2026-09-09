import type { TreeNode } from "@/utils/file-tree-utils";

export async function idecreateFile(
    targetPath: string,
    tree: TreeNode,
): Promise<{ success: boolean; path?: string; name?: string }> {
    const fileName = prompt(
        "Enter file name (including extension, e.g. script.py):",
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
            "Please include a file extension (e.g. .py, .js, .html)",
        );
        return { success: false };
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
                return { success: false };
            }

            parentNode = node.children;
        }
    }

    if (parentNode[trimmedName]) {
        alert(
            `A file or folder named "${trimmedName}" already exists.`,
        );
        return { success: false };
    }

    try {
        const response = await fetch(
            "/filesystem/files/create/",
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
            "[System] ✅ File created:",
            result,
        );
    } catch (error: unknown) {
        console.error(
            "[System] ❌ Failed to create file:",
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

    const defaultContent =
        `# ${trimmedName}\n` +
        `// New file created\n`;

    parentNode[trimmedName] = {
        type: "file",
        content: defaultContent,
        size: defaultContent.length,
    };

    return {
        success: true,
        path: normalizedPath
            ? `${normalizedPath}/${trimmedName}`
            : trimmedName,
        name: trimmedName,
    };
}