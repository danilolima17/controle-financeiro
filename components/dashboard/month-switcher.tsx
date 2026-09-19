import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  cn,
  currentMonthKey,
  formatCompactMonth,
  formatMonthLabel,
  shiftMonth,
} from "@/lib/utils";

/** Controle compacto: navega entre meses sem virar uma barra inteira. */
export function MonthSwitcher({
  monthKey,
  basePath,
  tone = "default",
}: {
  monthKey: string;
  basePath: string;
  /** `hero` para uso sobre o gradiente do saldo. */
  tone?: "default" | "hero";
}) {
  const isCurrent = monthKey === currentMonthKey();
  const isHero = tone === "hero";

  const arrow = cn(
    "flex size-7 items-center justify-center rounded-full transition-colors duration-150",
    isHero
      ? "text-hero-ink hover:bg-[var(--hero-glass-border)]"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
  );

  return (
    <div className="flex items-center gap-1">
      {!isCurrent && (
        <Link
          href={basePath}
          className={cn(
            "rounded-full px-2 py-1 text-[0.8125rem] font-semibold transition-colors",
            isHero
              ? "text-hero-ink hover:bg-[var(--hero-glass-border)]"
              : "text-primary hover:bg-accent"
          )}
        >
          Hoje
        </Link>
      )}

      <div
        className={cn(
          "flex items-center rounded-full p-0.5",
          isHero ? "glass" : "border-border bg-card border"
        )}
      >
        <Link
          href={`${basePath}?mes=${shiftMonth(monthKey, -1)}`}
          aria-label="Mês anterior"
          className={arrow}
        >
          <ChevronLeft className="size-4" />
        </Link>

        {/* Em tela estreita o nome do mês por extenso não cabe ao lado do
            rótulo do card. */}
        <span className="min-w-[4.75rem] px-1 text-center text-[0.8125rem] font-semibold sm:min-w-[7.5rem]">
          <span className="sm:hidden">{formatCompactMonth(monthKey)}</span>
          <span className="hidden sm:inline">{formatMonthLabel(monthKey)}</span>
        </span>

        <Link
          href={`${basePath}?mes=${shiftMonth(monthKey, 1)}`}
          aria-label="Próximo mês"
          className={arrow}
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
