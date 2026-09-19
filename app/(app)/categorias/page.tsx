import type { Metadata } from "next";
import { Plus, Shapes } from "lucide-react";

import { getCategories, getTransactions } from "@/lib/data/queries";
import { currentMonthKey, formatMonthLabel, monthRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { CategoryRow } from "@/components/categories/category-row";

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
      <PageHeader
        title="Categorias"
        description={`Valores de ${formatMonthLabel(monthKey).toLowerCase()}`}
        action={
          <CategoryDialog
            trigger={
              <Button size="sm">
                <Plus />
                Nova
              </Button>
            }
          />
        }
      />

      {groups.map((group) => (
        <section key={group.type} className="flex flex-col gap-2.5">
          <SectionHeader
            title={group.title}
            action={
              <span className="text-faint-foreground numeric text-xs">
                {group.items.length}
              </span>
            }
          />

          {group.items.length === 0 ? (
            <div className="bg-card shadow-soft rounded-lg border">
              <EmptyState
                icon={Shapes}
                title={`Nenhuma categoria de ${group.title.toLowerCase()}`}
                description="Crie uma para classificar seus lançamentos."
                className="py-8"
              />
            </div>
          ) : (
            <ul className="bg-card shadow-soft divide-border divide-y overflow-hidden rounded-lg border">
              {group.items.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  spent={spentByCategory.get(category.id) ?? 0}
                />
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
