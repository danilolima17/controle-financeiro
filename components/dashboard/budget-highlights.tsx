import { TriangleAlert } from "lucide-react";

import { colorPair } from "@/lib/palette";
import type { Category } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CategoryIcon } from "@/components/category-icon";
import type { CategorySlice } from "@/components/charts/category-breakdown";

/**
 * Orçamentos do mês. Só aparece quando o usuário definiu algum limite —
 * o alerta traz ícone e texto, nunca cor sozinha.
 */
export function BudgetHighlights({
  categories,
  slices,
}: {
  categories: Category[];
  slices: CategorySlice[];
}) {
  const spentById = new Map(slices.map((slice) => [slice.id, slice.total]));

  const budgets = categories
    .filter((category) => category.monthly_budget && category.monthly_budget > 0)
    .map((category) => {
      const spent = spentById.get(category.id) ?? 0;
      const budget = Number(category.monthly_budget);
      return {
        category,
        spent,
        budget,
        percent: Math.min((spent / budget) * 100, 100),
        exceeded: spent > budget,
      };
    })
    .sort((a, b) => b.spent / b.budget - a.spent / a.budget);

  if (budgets.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Orçamentos do mês</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {budgets.slice(0, 4).map(({ category, spent, budget, percent, exceeded }) => {
          const pair = colorPair(category.color);
          return (
            <div key={category.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <CategoryIcon
                    name={category.icon}
                    className="size-4 shrink-0 [color:var(--c-light)] dark:[color:var(--c-dark)]"
                    style={
                      {
                        "--c-light": pair.light,
                        "--c-dark": pair.dark,
                      } as React.CSSProperties
                    }
                  />
                  <span className="truncate font-medium">{category.name}</span>
                </span>
                {exceeded && (
                  <span className="text-expense flex shrink-0 items-center gap-1 text-xs font-medium">
                    <TriangleAlert className="size-3.5" />
                    Estourou
                  </span>
                )}
              </div>

              <Progress
                value={percent}
                indicatorStyle={{
                  background: exceeded ? "var(--expense)" : pair.light,
                }}
              />

              <p className="tabular text-muted-foreground text-xs">
                {formatCurrency(spent)} de {formatCurrency(budget)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
