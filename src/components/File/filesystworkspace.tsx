import { useState, useCallback, useMemo, useEffect } from "react";

type FlatFileEntry = {
  type: "file";
  name: string;
  content: string;
  size: number;
};

type FlatFolderEntry = {
  type: "folder";
  name: string;
};

type FlatEntry = FlatFileEntry | FlatFolderEntry;
type FlatStructure = Record<string, FlatEntry>;

interface TreeFileNode {
  type: "file";
}

interface TreeFolderNode {
  type: "folder";
  children: TreeNode;
}

type TreeNode = {
  [name: string]: TreeFileNode | TreeFolderNode;
};

function getDefaultFlatStructure(): FlatStructure {
  return {
    "src/index.js": {
      type: "file",
      name: "index.js",
      content: "// index.js\nconsole.log('Hello World');",
      size: 30,
    },
    "src/styles.css": {
      type: "file",
      name: "styles.css",
      content: "/* styles.css */\nbody { margin: 0; }",
      size: 35,
    },
    "public/index.html": {
      type: "file",
      name: "index.html",
      content: "<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello</h1>\n</body>\n</html>",
      size: 60,
    },
    "package.json": {
      type: "file",
      name: "package.json",
      content: '{\n  "name": "app"\n}',
      size: 20,
    },
  };
}

function buildTreeFromFlatStructure(
  flatStructure: FlatStructure,
  fileContents: Record<string, string>
): TreeNode {
  const tree: TreeNode = {};

  Object.keys(flatStructure).forEach((path) => {
    const parts = path.split("/");
    let current: TreeNode = tree;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      if (isLast) {
        const entry = flatStructure[path];

        if (entry.type === "file") {
          current[part] = { type: "file" };

          if (entry.content && !fileContents[part]) {
            fileContents[part] = entry.content;
          }
        } else {
          if (!current[part]) {
            current[part] = {
              type: "folder",
              children: {},
            };
          }
        }
      } else {
        if (!current[part]) {
          current[part] = {
            type: "folder",
            children: {},
          };
        }

        current = (current[part] as TreeFolderNode).children;
      }
    });
  });

  return tree;
}

interface ExplorerNodeProps {
  node: TreeNode;
  path: string;
  openFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  activeFile: string | null;
}

function ExplorerNode({
  node,
  path,
  openFolders,
  onToggleFolder,
  onSelectFile,
  activeFile,
}: ExplorerNodeProps) {
  return (
    <>
      {Object.entries(node).map(([name, data]) => {
        const fullPath = path ? `${path}/${name}` : name;

        if (data.type === "folder") {
          const isOpen = openFolders.has(fullPath);

          return (
            <div key={fullPath} className="flex flex-col">
              <div
                className="flex cursor-pointer select-none items-center gap-1.5 rounded px-2 py-1 text-sm text-gray-200 hover:bg-[#1a1a1a]/70"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFolder(fullPath);
                }}
              >
                <span className="w-5 text-xl leading-none text-white">
                  {isOpen ? "⌄" : "›"}
                </span>

                <span className="truncate text-base">
                  {name}
                </span>
              </div>

              {isOpen && (
                <div className="ml-4 flex flex-col border-l border-gray-700 pl-2">
                  <ExplorerNode
                    node={data.children}
                    path={fullPath}
                    openFolders={openFolders}
                    onToggleFolder={onToggleFolder}
                    onSelectFile={onSelectFile}
                    activeFile={activeFile}
                  />
                </div>
              )}
            </div>
          );
        }

        const isActive = activeFile === fullPath;

        return (
          <div
            key={fullPath}
            onClick={(e) => {
              e.stopPropagation();
              console.log(`📁 File clicked: ${fullPath}`);
              onSelectFile(fullPath);
            }}
            className={`flex cursor-pointer select-none items-center gap-1.5 rounded px-2 py-1 text-sm ${
              isActive
                ? "bg-[#1a1a1a] text-white"
                : "text-gray-300 hover:bg-[#1a1a1a]/70"
            }`}
          >
            <span className="truncate">{name}</span>
          </div>
        );
      })}
    </>
  );
}

export default function WorkSpace() {
  const [fileStructure, setFileStructure] =
    useState<FlatStructure>(getDefaultFlatStructure());

  const [openFolders, setOpenFolders] = useState<Set<string>>(
    () => new Set(["src", "public"])
  );

  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔥 activeFile changed:", activeFile);
  }, [activeFile]);

  const importFromServer = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/filesystem/directory-builder/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Directory builder failed with status ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.structure) {
        throw new Error(
          "No directory structure received from server"
        );
      }

      setFileStructure(data.structure);

      const paths = Object.keys(data.structure);

      const defaultPath =
        paths.find(
          (p) =>
            data.structure[p].type === "file" &&
            p === "package.json"
        ) ??
        paths.find(
          (p) => data.structure[p].type === "file"
        ) ??
        null;

      setActiveFile(defaultPath);
    } catch (err) {
      console.error(
        "[System] ❌ Directory builder failed:",
        err
      );

      setError(
        err instanceof Error ? err.message : "Unknown error"
      );

      setFileStructure(getDefaultFlatStructure());
      setActiveFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    importFromServer();
  }, [importFromServer]);

  const tree = useMemo(
    () => buildTreeFromFlatStructure(fileStructure, {}),
    [fileStructure]
  );

  const handleToggleFolder = useCallback((path: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  }, []);

  return (
    <div className="h-full w-full min-w-0 overflow-y-auto bg-[#1a1a1a] text-gray-100">
      <div className="flex h-full w-full min-w-0 flex-col overflow-y-auto p-2">
        <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <span>Explorer</span>

          {loading && (
            <span className="normal-case text-gray-500">
              loading…
            </span>
          )}
        </div>

        {error && (
          <div className="mb-2 rounded bg-red-900/30 px-2 py-1 text-xs text-red-300">
            {error} — showing default files
          </div>
        )}

        {Object.keys(fileStructure).length === 0 ? (
          <div className="px-2 py-2 text-sm text-gray-500">
            No files loaded
          </div>
        ) : (
          <ExplorerNode
            node={tree}
            path=""
            openFolders={openFolders}
            onToggleFolder={handleToggleFolder}
            onSelectFile={setActiveFile}
            activeFile={activeFile}
          />
        )}
      </div>
    </div>
  );
}