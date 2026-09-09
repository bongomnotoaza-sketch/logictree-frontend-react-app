import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <Input
        placeholder="Search"
        className="h-9 rounded-full border-zinc-800 bg-zinc-900 pl-9 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/40"
      />
    </div>
  );
}