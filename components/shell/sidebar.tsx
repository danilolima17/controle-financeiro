"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/shell/nav-items";
import { BrandMark } from "@/components/shell/brand-mark";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150",
              active
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            <item.icon
              className={cn("size-[18px]", active && "text-primary")}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-1">
      <BrandMark />
      <span className="text-[0.9375rem] font-semibold tracking-tight">
        Controle
      </span>
    </Link>
  );
}
