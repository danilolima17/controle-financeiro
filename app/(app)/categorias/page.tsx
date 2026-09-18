import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { getCategories, getTransactions } from "@/lib/data/queries";
import { currentMonthKey, monthRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/categories/category-card";
import { CategoryDialog } from "@/components/categories/category-dialog";

export const metadata: Metadata = {
  title: "Categorias — Controle Financeiro",
};

export default async function CategoriesPage() {
  const monthKey = currentMonthKey();
  const { from, to } = monthRange(monthKey);

  const [categories, transactions] = await Promise.all([
    getCategories(),
    getTransactions({ from, to }),
  ]);

  const spentByCategory = new Map<string, number>();
  for (const transaction of transactions) {
    if (!transaction.category_id) continue;
    spentByCategory.set(
      transaction.category_id,
      (spentByCategory.get(transaction.category_id) ?? 0) + transaction.amount
    );
  }

  const groups = [
    {
      title: "Despesas",
      type: "expense" as const,
      items: categories.filter((category) => category.type === "expense"),
    },
    {
      title: "Receitas",
      type: "income" as const,
      items: categories.filter((category) => category.type === "income"),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
        <CategoryDialog
          trigger={
            <Button variant="brand" size="sm">
              <Plus />
              Nova
            </Button>
          }
        />
      </div>

      {groups.map((group) => (
        <section key={group.type} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              {group.title}
            </h2>
            <span className="text-muted-foreground text-xs">
              {group.items.length}
            </span>
          </div>

          {group.items.length === 0 ? (
            <p className="text-muted-foreground rounded-2xl border border-dashed py-8 text-center text-sm">
              Nenhuma categoria de {group.title.toLowerCase()}.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  spent={spentByCategory.get(category.id) ?? 0}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
