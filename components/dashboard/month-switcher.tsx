import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  currentMonthKey,
  formatCompactMonth,
  formatMonthLabel,
  shiftMonth,
} from "@/lib/utils";

/** Controle compacto: navega entre meses sem virar uma barra inteira. */
export function MonthSwitcher({
  monthKey,
  basePath,
}: {
  monthKey: string;
  basePath: string;
}) {
  const isCurrent = monthKey === currentMonthKey();
  const arrow =
    "text-muted-foreground hover:text-foreground hover:bg-secondary flex size-8 items-center justify-center rounded-md transition-colors duration-150";

  return (
    <div className="flex items-center gap-1">
      {!isCurrent && (
        <Link
          href={basePath}
          className="text-primary hover:bg-accent mr-1 rounded-md px-2 py-1 text-[0.8125rem] font-medium transition-colors"
        >
          Hoje
        </Link>
      )}

      <div className="border-border bg-card flex items-center rounded-md border p-0.5">
        <Link
          href={`${basePath}?mes=${shiftMonth(monthKey, -1)}`}
          aria-label="Mês anterior"
          className={arrow}
        >
          <ChevronLeft className="size-4" />
        </Link>

        {/* Em tela estreita o nome do mês por extenso não cabe ao lado do
            rótulo do card. */}
        <span className="min-w-[4.75rem] px-1 text-center text-[0.8125rem] font-medium sm:min-w-[7.5rem]">
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
