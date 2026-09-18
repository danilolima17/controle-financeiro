import { colorPair } from "@/lib/palette";
import { formatCurrency } from "@/lib/utils";
import { CategoryIcon } from "@/components/category-icon";

export type CategorySlice = {
  id: string;
  name: string;
  color: string;
  icon: string;
  total: number;
};

export function CategoryBreakdown({ slices }: { slices: CategorySlice[] }) {
  if (slices.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Nenhuma despesa neste mês.
      </p>
    );
  }

  const max = Math.max(...slices.map((slice) => slice.total));
  const total = slices.reduce((sum, slice) => sum + slice.total, 0);

  return (
    <ul className="flex flex-col gap-4">
      {slices.map((slice) => {
        const pair = colorPair(slice.color);
        const share = total > 0 ? (slice.total / total) * 100 : 0;

        return (
          <li key={slice.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white [background:var(--bar-light)] dark:[background:var(--bar-dark)]"
                  style={
                    {
                      "--bar-light": pair.light,
                      "--bar-dark": pair.dark,
                    } as React.CSSProperties
                  }
                >
                  <CategoryIcon name={slice.icon} className="size-3.5" />
                </span>
                <span className="truncate font-medium">{slice.name}</span>
              </span>
              <span className="tabular flex shrink-0 items-baseline gap-2">
                <span className="text-muted-foreground text-xs">
                  {Math.round(share)}%
                </span>
                <span className="font-semibold">
                  {formatCurrency(slice.total)}
                </span>
              </span>
            </div>

            <div className="bg-secondary h-2 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full [background:var(--bar-light)] dark:[background:var(--bar-dark)]"
                style={
                  {
                    width: `${Math.max((slice.total / max) * 100, 3)}%`,
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
