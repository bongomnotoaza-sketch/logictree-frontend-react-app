import { useCallback, useEffect, useState } from "react";

export interface TreeFileNode {
  type: "file";
  content?: string;
  size?: number;
}

export interface TreeFolderNode {
  type: "folder";
  children: TreeNode;
}

export type TreeNode = {
  [name: string]: TreeFileNode | TreeFolderNode;
};

interface FlatFileEntry {
  type: "file";
  name: string;
  content: string;
  size: number;
}

interface FlatFolderEntry {
  type: "folder";
  name: string;
}

type FlatEntry = FlatFileEntry | FlatFolderEntry;
type FlatStructure = Record<string, FlatEntry>;

export interface SearchResult {
  name: string;
  path: string;
  type: "file" | "folder";
}

export function buildTreeFromFlatStructure(flatStructure: FlatStructure): TreeNode {
  const tree: TreeNode = {};

  Object.keys(flatStructure).forEach((path) => {
    const parts = path.split("/");
    let current: TreeNode = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        const entry = flatStructure[path];
        if (entry.type === "file") {
          current[part] = { type: "file", content: entry.content, size: entry.size };
        } else if (entry.type === "folder") {
          if (!current[part]) {
            current[part] = { type: "folder", children: {} };
          }
        }
      } else {
        if (!current[part]) {
          current[part] = { type: "folder", children: {} };
        }
        current = (current[part] as TreeFolderNode).children;
      }
    }
  });

  return tree;
}

export function getNode(tree: TreeNode, path: string): TreeFolderNode | null {
  if (!path) {
    return { type: "folder", children: tree };
  }

  const parts = path.split("\\").filter(Boolean);
  let current: TreeNode | undefined = tree;
  let node: TreeFileNode | TreeFolderNode | null = null;

  for (const part of parts) {
    if (!current || !current[part]) return null;
    node = current[part];
    if (node.type === "folder") {
      current = node.children;
    } else {
      current = undefined;
    }
  }

  return node && node.type === "folder" ? node : null;
}

// Recursively search the tree by filename. Only files are returned as
// results (matching folder names doesn't produce a hit), but the search
// descends into every folder regardless of whether the folder name matches.
export function searchFiles(
  query: string,
  node: TreeNode,
  currentPath: string = ""
): SearchResult[] {
  let results: SearchResult[] = [];
  if (!node || !query) return results;

  const q = query.toLowerCase();

  for (const [key, child] of Object.entries(node)) {
    const path = currentPath ? `${currentPath}\\${key}` : key;

    if (child.type === "file") {
      if (key.toLowerCase().includes(q)) {
        results.push({ name: key, path, type: "file" });
      }
    } else if (child.type === "folder") {
      results = results.concat(searchFiles(query, child.children, path));
    }
  }

  return results;
}

// Ensure Devicon's stylesheet is present exactly once.
export function ensureDeviconLoaded() {
  if (typeof document === "undefined") return;
  if (document.getElementById("devicon-cdn-link")) return;
  const link = document.createElement("link");
  link.id = "devicon-cdn-link";
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/devicon/2.15.1/devicon.min.css";
  document.head.appendChild(link);
}

// Devicon class mapping by extension — extend as needed
export function getFileIconClass(filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    js: "devicon-javascript-plain colored",
    mjs: "devicon-javascript-plain colored",
    cjs: "devicon-javascript-plain colored",
    jsx: "devicon-react-original colored",
    ts: "devicon-typescript-plain colored",
    tsx: "devicon-react-original colored",
    vue: "devicon-vuejs-plain colored",
    css: "devicon-css3-plain colored",
    scss: "devicon-sass-original colored",
    sass: "devicon-sass-original colored",
    less: "devicon-less-plain-wordmark colored",
    html: "devicon-html5-plain colored",
    htm: "devicon-html5-plain colored",
    json: "devicon-json-plain colored",
    yml: "devicon-yaml-plain colored",
    yaml: "devicon-yaml-plain colored",
    xml: "devicon-xml-plain colored",
    toml: "devicon-toml-plain colored",
    sql: "devicon-azuresqldatabase-plain colored",
    graphql: "devicon-graphql-plain colored",
    gql: "devicon-graphql-plain colored",
    md: "devicon-markdown-original colored",
    py: "devicon-python-plain colored",
    java: "devicon-java-plain colored",
    kt: "devicon-kotlin-plain colored",
    rb: "devicon-ruby-plain colored",
    go: "devicon-go-original-wordmark colored",
    rs: "devicon-rust-plain",
    php: "devicon-php-plain colored",
    c: "devicon-c-plain colored",
    h: "devicon-c-plain colored",
    cpp: "devicon-cplusplus-plain colored",
    cc: "devicon-cplusplus-plain colored",
    hpp: "devicon-cplusplus-plain colored",
    cs: "devicon-csharp-plain colored",
    swift: "devicon-swift-plain colored",
    dart: "devicon-dart-plain colored",
    lua: "devicon-lua-plain colored",
    r: "devicon-r-plain colored",
    scala: "devicon-scala-plain colored",
    sh: "devicon-bash-plain colored",
    bash: "devicon-bash-plain colored",
    dockerfile: "devicon-docker-plain colored",
  };
  return ext ? map[ext] ?? null : null;
}

// Fetches and builds the tree once, shared by whichever components need it
// (the grid view and the search bar both read from the same tree).
export function useFileTree() {
  const [tree, setTree] = useState<TreeNode>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/filesystem/directory-builder/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Directory builder failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.structure) {
        throw new Error("No directory structure received from server");
      }

      setTree(buildTreeFromFlatStructure(data.structure));
    } catch (err) {
      console.error("[System] ❌ Directory builder failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setTree({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ensureDeviconLoaded();
    refetch();
  }, [refetch]);

  return { tree, loading, error, refetch };
}