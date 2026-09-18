import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { getCategories, getTransactions } from "@/lib/data/queries";
import type { TransactionWithCategory } from "@/lib/types";
import {
  currentMonthKey,
  formatShortMonth,
  isValidMonthKey,
  monthRange,
  shiftMonth,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CategoryBreakdown,
  type CategorySlice,
} from "@/components/charts/category-breakdown";
import { MonthlyChart, type MonthlyPoint } from "@/components/charts/monthly-chart";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { BudgetHighlights } from "@/components/dashboard/budget-highlights";
import { MonthSwitcher } from "@/components/dashboard/month-switcher";
import { TransactionItem } from "@/components/transactions/transaction-item";

export const metadata: Metadata = {
  title: "Início — Controle Financeiro",
};

function sumBy(
  transactions: TransactionWithCategory[],
  type: "income" | "expense"
) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const { mes } = await searchParams;
  const requested = typeof mes === "string" ? mes : undefined;
  const monthKey = isValidMonthKey(requested) ? requested : currentMonthKey();

  const { from, to } = monthRange(monthKey);
  const chartStart = monthRange(shiftMonth(monthKey, -5)).from;

  const [categories, monthTransactions, historyTransactions] = await Promise.all(
    [
      getCategories(),
      getTransactions({ from, to }),
      getTransactions({ from: chartStart, to }),
    ]
  );

  const income = sumBy(monthTransactions, "income");
  const expense = sumBy(monthTransactions, "expense");

  // Série dos últimos 6 meses
  const series: MonthlyPoint[] = Array.from({ length: 6 }, (_, index) => {
    const key = shiftMonth(monthKey, index - 5);
    const inMonth = historyTransactions.filter((transaction) =>
      transaction.occurred_on.startsWith(key)
    );
    return {
      label: formatShortMonth(key),
      income: sumBy(inMonth, "income"),
      expense: sumBy(inMonth, "expense"),
    };
  });

  // Despesas por categoria no mês
  const totals = new Map<string, CategorySlice>();
  for (const transaction of monthTransactions) {
    if (transaction.type !== "expense") continue;
    const id = transaction.category?.id ?? "none";
    const current = totals.get(id);
    if (current) {
      current.total += transaction.amount;
    } else {
      totals.set(id, {
        id,
        name: transaction.category?.name ?? "Sem categoria",
        color: transaction.category?.color ?? "#2a78d6",
        icon: transaction.category?.icon ?? "tag",
        total: transaction.amount,
      });
    }
  }
  const slices = [...totals.values()].sort((a, b) => b.total - a.total);
  const topSlices = slices.slice(0, 6);
  const rest = slices.slice(6);
  if (rest.length > 0) {
    topSlices.push({
      id: "outras",
      name: "Outras",
      color: "#2a78d6",
      icon: "tag",
      total: rest.reduce((sum, slice) => sum + slice.total, 0),
    });
  }

  const recent = monthTransactions.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <MonthSwitcher monthKey={monthKey} basePath="/dashboard" />

      <BalanceHero
        balance={income - expense}
        income={income}
        expense={expense}
      />

      <BudgetHighlights categories={categories} slices={slices} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart data={series} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gastos por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryBreakdown slices={topSlices} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Transações recentes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/transacoes?mes=${monthKey}`}>
              Ver todas
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="bg-accent text-primary flex size-12 items-center justify-center rounded-2xl">
                <Sparkles className="size-5" />
              </span>
              <p className="text-muted-foreground text-sm">
                Nenhuma transação neste mês ainda.
                <br />
                Toque no + para registrar a primeira.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {recent.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  categories={categories}
                  showDate
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
