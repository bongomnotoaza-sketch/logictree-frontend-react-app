import { useEffect, useRef, useState } from "react";
import { Search, File as FileIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TreeNode, SearchResult } from "./file-tree-utils";
import { searchFiles, getFileIconClass } from "./file-tree-utils";

interface FileSearchBarProps {
  tree: TreeNode;
  onNavigate: (path: string) => void;
}

// Splits "folder\sub\file.ts" into { dirPath: "folder\sub", fileName: "file.ts" }
function splitPath(path: string): { dirPath: string; fileName: string } {
  const parts = path.split("\\");
  const fileName = parts.pop() ?? "";
  return { dirPath: parts.join("\\"), fileName };
}

export default function FileSearchBar({ tree, onNavigate }: FileSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-run search whenever the query or the underlying tree changes
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setResults(searchFiles(trimmed, tree));
    setIsOpen(true);
  }, [query, tree]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const goToResult = (result: SearchResult) => {
    const { dirPath } = splitPath(result.path);
    setIsOpen(false);
    setQuery("");
    onNavigate(dirPath);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = query.trim();
      if (trimmed) {
        const liveResults = searchFiles(trimmed, tree);
        if (liveResults.length > 0) {
          goToResult(liveResults[0]);
        }
      }
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="search-container relative mx-auto flex h-full w-[90%] max-w-sm items-center">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <Input
        ref={inputRef}
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.trim() && setIsOpen(true)}
        className="h-9 w-full rounded-full border-zinc-800 bg-zinc-900 pl-9 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/40"
      />

      {isOpen && (
        <div
          id="searchResults"
          className="visible absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <div className="search-result-item px-3 py-2 text-sm" style={{ color: "#3a5a3a" }}>
              No files found
            </div>
          ) : (
            results.map((result) => {
              const iconClass = getFileIconClass(result.name);
              const { dirPath } = splitPath(result.path);
              return (
                <div
                  key={result.path}
                  className="search-result-item flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToResult(result);
                  }}
                >
                  {iconClass ? (
                    <i className={`devicon ${iconClass} text-base`} />
                  ) : (
                    <FileIcon className="h-4 w-4 text-zinc-500" />
                  )}
                  <span className="truncate">{result.name}</span>
                  <span className="result-path ml-auto truncate text-xs text-zinc-500">
                    {dirPath || "Home"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}