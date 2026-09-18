"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/shell/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card/60 hidden w-64 shrink-0 flex-col border-r px-4 py-6 md:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-xl text-white shadow-lg shadow-primary/25">
          <Wallet className="size-5" />
        </span>
        <span className="text-base font-semibold tracking-tight">
          Controle
          <span className="text-brand-gradient"> Financeiro</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
