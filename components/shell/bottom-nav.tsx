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
          "flex flex-1 flex-col items-center justify-center gap-1 pt-2.5 pb-1.5 text-[0.6875rem] transition-colors duration-150",
          active
            ? "text-primary font-medium"
            : "text-faint-foreground font-normal"
        )}
      >
        <entry.icon className="size-[19px]" strokeWidth={active ? 2.25 : 1.75} />
        {entry.label}
      </Link>
    );
  };

  return (
    <nav className="bg-card/90 pb-safe fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t backdrop-blur-xl md:hidden">
      {item(first)}
      {item(second)}

      <div className="relative w-16 shrink-0">
        <TransactionDialog
          categories={categories}
          trigger={
            <button
              type="button"
              aria-label="Nova transação"
              className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary-hover absolute -top-5 left-1/2 flex size-13 -translate-x-1/2 items-center justify-center rounded-full shadow-lg transition-transform duration-150 active:scale-95"
            >
              <Plus className="size-6" />
            </button>
          }
        />
      </div>

      {item(third)}
      {item(fourth)}
    </nav>
  );
}
