import { useEffect, useState } from "react";
import { Bell, CalendarDays, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./searchbar";
import { getCurrentUser, getInitials } from "@/utils/current_user";
import type { CurrentUser } from "@/utils/current_user";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const initials = getInitials(user);
  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : undefined;

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-zinc-300 hover:bg-zinc-900 hover:text-white md:hidden"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <SearchBar />

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-zinc-300 hover:bg-zinc-900 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />

          <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full bg-emerald-500 px-1 text-[10px] text-zinc-950 hover:bg-emerald-500">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-300 hover:bg-zinc-900 hover:text-white"
          aria-label="Calendar"
        >
          <CalendarDays className="h-4.5 w-4.5" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6 bg-zinc-800" />

        <Avatar className="h-8 w-8 border border-emerald-500/60" title={fullName}>
          <AvatarFallback className="bg-zinc-900 text-xs font-medium text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}