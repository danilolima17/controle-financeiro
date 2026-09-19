import Link from "next/link";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function initialsOf(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return value.slice(0, 2).toUpperCase();
}

export function UserMenu({
  name,
  email,
  variant = "compact",
}: {
  name: string;
  email: string;
  variant?: "compact" | "row";
}) {
  const initials = initialsOf(name || email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center rounded-md transition-colors",
          variant === "row"
            ? "hover:bg-secondary w-full gap-2.5 p-2 text-left"
            : "hover:bg-secondary size-9 justify-center"
        )}
        aria-label="Conta"
      >
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-[0.6875rem] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {variant === "row" && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{name}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {email}
              </span>
            </span>
            <ChevronsUpDown className="text-faint-foreground size-4 shrink-0" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={variant === "row" ? "start" : "end"}
        side={variant === "row" ? "top" : "bottom"}
        className="w-60"
      >
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-muted-foreground truncate text-xs">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/ajustes">
            <Settings />
            Ajustes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem asChild variant="destructive" className="cursor-pointer">
            <button type="submit" className="w-full">
              <LogOut />
              Sair da conta
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
