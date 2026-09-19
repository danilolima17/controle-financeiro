import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { colorPair } from "@/lib/palette";
import type { Category } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CategorySlice } from "@/components/charts/category-breakdown";

/**
 * Orçamentos do mês. Só aparece quando existe algum limite definido, e o
 * alerta de estouro traz ícone e texto — nunca só a cor.
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
        ratio: spent / budget,
        exceeded: spent > budget,
      };
    })
    .sort((a, b) => b.ratio - a.ratio);

  if (budgets.length === 0) return null;

  const exceededCount = budgets.filter((item) => item.exceeded).length;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Orçamentos</CardTitle>
          {exceededCount > 0 && (
            <p className="text-expense mt-0.5 flex items-center gap-1.5 text-[0.8125rem]">
              <TriangleAlert className="size-3.5" />
              {exceededCount === 1
                ? "1 categoria acima do limite"
                : `${exceededCount} categorias acima do limite`}
            </p>
          )}
        </div>
        <Button variant="link" size="sm" asChild>
          <Link href="/categorias">Gerenciar</Link>
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {budgets.slice(0, 4).map(({ category, spent, budget, ratio, exceeded }) => {
          const pair = colorPair(category.color);
          return (
            <div key={category.id} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-medium">
                  {category.name}
                </span>
                <span
                  className={cn(
                    "numeric shrink-0 text-[0.8125rem]",
                    exceeded ? "text-expense font-medium" : "text-muted-foreground"
                  )}
                >
                  {formatCurrency(spent)}
                  <span className="text-faint-foreground">
                    {" "}
                    / {formatCurrency(budget)}
                  </span>
                </span>
              </div>

              <Progress
                value={Math.min(ratio * 100, 100)}
                aria-label={`${category.name}: ${Math.round(ratio * 100)}% do orçamento`}
                indicatorStyle={{
                  background: exceeded ? "var(--expense)" : pair.light,
                }}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
