import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { currentMonthKey, formatMonthLabel, shiftMonth } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MonthSwitcher({
  monthKey,
  basePath,
}: {
  monthKey: string;
  basePath: string;
}) {
  const isCurrent = monthKey === currentMonthKey();

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" size="icon" asChild>
        <Link
          href={`${basePath}?mes=${shiftMonth(monthKey, -1)}`}
          aria-label="Mês anterior"
        >
          <ChevronLeft />
        </Link>
      </Button>

      <div className="text-center">
        <p className="text-sm font-semibold">
          {formatMonthLabel(monthKey)}
        </p>
        {!isCurrent && (
          <Link
            href={basePath}
            className="text-primary text-xs hover:underline"
          >
            Voltar para o mês atual
          </Link>
        )}
      </div>

      <Button variant="outline" size="icon" asChild>
        <Link
          href={`${basePath}?mes=${shiftMonth(monthKey, 1)}`}
          aria-label="Próximo mês"
        >
          <ChevronRight />
        </Link>
      </Button>
    </div>
  );
}
