import { Wallet } from "lucide-react";

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

export function Header({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-semibold">
          <Wallet className="size-5" />
          <span>Controle Financeiro</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-2 px-2 py-1.5"
            >
              <Avatar className="size-7">
                <AvatarFallback className="text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm sm:inline">{email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <span className="text-muted-foreground text-xs">
                Conectado como
              </span>
              <p className="truncate text-sm font-medium">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem
                asChild
                variant="destructive"
                className="cursor-pointer"
              >
                <button type="submit" className="w-full">
                  Sair
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
