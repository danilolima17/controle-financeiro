import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/shell/brand-mark";
import { UserMenu } from "@/components/shell/user-menu";

/** Barra superior do celular. No desktop a navegação vive na sidebar. */
export function TopBar({ email, name }: { email: string; name: string }) {
  return (
    <header className="bg-background/85 pt-safe sticky top-0 z-30 border-b backdrop-blur-xl md:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BrandMark className="size-7 rounded-sm" />
          <span className="text-[0.9375rem] font-semibold tracking-tight">
            Controle
          </span>
        </Link>

        <div className="flex items-center gap-0.5">
          <ThemeToggle />
          <UserMenu name={name} email={email} />
        </div>
      </div>
    </header>
  );
}
