"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/shell/nav-items";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";

export function BottomNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [first, second, third, fourth] = NAV_ITEMS;

  const item = (entry: (typeof NAV_ITEMS)[number]) => {
    const active = pathname === entry.href;
    return (
      <Link
        key={entry.href}
        href={entry.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-[0.6875rem] transition-colors duration-150",
          active
            ? "text-primary font-semibold"
            : "text-faint-foreground font-medium"
        )}
      >
        <entry.icon className="size-[19px]" strokeWidth={active ? 2.25 : 1.75} />
        {entry.label}
      </Link>
    );
  };

  return (
    // Ilha flutuante em vez de barra colada na borda: o app ganha ar embaixo
    // e o botão de ação se destaca acima dela.
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="bg-card/85 shadow-float flex items-stretch rounded-2xl border px-1 backdrop-blur-xl">
        {item(first)}
        {item(second)}

        <div className="relative w-14 shrink-0">
          <TransactionDialog
            categories={categories}
            trigger={
              <button
                type="button"
                aria-label="Nova transação"
                className="bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary-hover absolute -top-6 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full shadow-lg transition-transform duration-150 active:scale-95"
              >
                <Plus className="size-6" strokeWidth={2.5} />
              </button>
            }
          />
        </div>

        {item(third)}
        {item(fourth)}
      </div>
    </nav>
  );
}
