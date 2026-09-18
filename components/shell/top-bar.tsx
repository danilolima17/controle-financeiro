import Link from "next/link";
import { LogOut, Wallet } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopBar({ email, name }: { email: string; name: string }) {
  const initials = (name || email).slice(0, 2).toUpperCase();

  return (
    <header className="bg-background/80 pt-safe sticky top-0 z-30 border-b backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
          <span className="bg-brand-gradient flex size-8 items-center justify-center rounded-lg text-white">
            <Wallet className="size-4" />
          </span>
          <span className="font-semibold">Controle</span>
        </Link>

        <p className="text-muted-foreground hidden text-sm md:block">
          Olá, <span className="text-foreground font-medium">{name}</span> 👋
        </p>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Conta">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-brand-gradient text-[11px] font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/ajustes">Ajustes</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={logout}>
                <DropdownMenuItem
                  asChild
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <button type="submit" className="w-full">
                    <LogOut />
                    Sair
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
