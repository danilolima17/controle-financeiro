import { PieChart } from "lucide-react";

import { colorPair } from "@/lib/palette";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export type CategorySlice = {
  id: string;
  name: string;
  color: string;
  icon: string;
  total: number;
};

/**
 * Barras horizontais ordenadas por valor. Cada linha traz nome, participação
 * e valor — a cor identifica, mas nunca é a única pista.
 */
export function CategoryBreakdown({ slices }: { slices: CategorySlice[] }) {
  if (slices.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="Sem despesas neste mês"
        description="Os gastos aparecem aqui agrupados por categoria."
        className="py-8"
      />
    );
  }

  const total = slices.reduce((sum, slice) => sum + slice.total, 0);
  const max = Math.max(...slices.map((slice) => slice.total));

  return (
    <ul className="flex flex-col gap-3.5">
      {slices.map((slice) => {
        const pair = colorPair(slice.color);
        const share = total > 0 ? (slice.total / total) * 100 : 0;

        return (
          <li key={slice.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-baseline gap-2">
                <span
                  aria-hidden
                  className="size-2 shrink-0 translate-y-[-1px] rounded-full [background:var(--bar-light)] dark:[background:var(--bar-dark)]"
                  style={
                    {
                      "--bar-light": pair.light,
                      "--bar-dark": pair.dark,
                    } as React.CSSProperties
                  }
                />
                <span className="truncate">{slice.name}</span>
                <span className="numeric text-faint-foreground shrink-0 text-xs">
                  {Math.round(share)}%
                </span>
              </span>
              <span className="numeric shrink-0 font-medium">
                {formatCurrency(slice.total)}
              </span>
            </div>

            <div className="bg-surface-sunken h-1.5 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full [background:var(--bar-light)] dark:[background:var(--bar-dark)]"
                style={
                  {
                    width: `${Math.max((slice.total / max) * 100, 2)}%`,
                    "--bar-light": pair.light,
                    "--bar-dark": pair.dark,
                  } as React.CSSProperties
                }
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
