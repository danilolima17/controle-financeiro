"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";
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
          "flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-1 text-[11px] font-medium transition-colors",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
            active && "bg-accent"
          )}
        >
          <entry.icon className="size-[18px]" />
        </span>
        {entry.label}
      </Link>
    );
  };

  return (
    <nav className="bg-card/85 pb-safe fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t backdrop-blur-xl md:hidden">
      {item(first)}
      {item(second)}

      <div className="relative w-16 shrink-0">
        <TransactionDialog
          categories={categories}
          trigger={
            <button
              type="button"
              aria-label="Nova transação"
              className="bg-brand-gradient absolute -top-5 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-xl shadow-primary/35 transition-transform active:scale-95"
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
