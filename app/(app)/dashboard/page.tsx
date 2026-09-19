import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";

import { getCategories, getTransactions } from "@/lib/data/queries";
import { createClient } from "@/lib/supabase/server";
import type { TransactionWithCategory } from "@/lib/types";
import {
  currentMonthKey,
  formatShortMonth,
  isValidMonthKey,
  monthRange,
  shiftMonth,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  CategoryBreakdown,
  type CategorySlice,
} from "@/components/charts/category-breakdown";
import {
  MonthlyChart,
  type MonthlyPoint,
} from "@/components/charts/monthly-chart";
import { BalanceSummary } from "@/components/dashboard/balance-summary";
import { BudgetHighlights } from "@/components/dashboard/budget-highlights";
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

  const supabase = await createClient();
  const [{ data: auth }, categories, monthTransactions, historyTransactions] =
    await Promise.all([
      supabase.auth.getUser(),
      getCategories(),
      getTransactions({ from, to }),
      getTransactions({ from: chartStart, to }),
    ]);

  const firstName =
    ((auth.user?.user_metadata?.full_name as string | undefined) ??
      auth.user?.email?.split("@")[0] ??
      "")
      .trim()
      .split(" ")[0];

  const income = sumBy(monthTransactions, "income");
  const expense = sumBy(monthTransactions, "expense");

  // Série dos últimos 6 meses, já disponível para o comparativo do saldo.
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

  const previous = series[series.length - 2];
  const previousBalance = previous
    ? previous.income - previous.expense
    : null;

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
      <header>
        <h1 className="text-[1.625rem] leading-9 font-bold tracking-tight">
          Olá{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {income - expense >= 0
            ? "Seu mês está no azul — siga assim."
            : "As despesas passaram as receitas neste mês."}
        </p>
      </header>

      <BalanceSummary
        monthKey={monthKey}
        income={income}
        expense={expense}
        previousBalance={previousBalance}
      />

      <BudgetHighlights categories={categories} slices={slices} />

      {/* Em tela larga os dois blocos de análise dividem a linha, em vez de
          uma coluna esticada com muito espaço vazio dos lados. */}
      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Receitas e despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={series} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown slices={topSlices} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações recentes</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link href={`/transacoes?mes=${monthKey}`}>
              Ver todas
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className={recent.length === 0 ? "px-0 pb-0" : "px-2"}>
          {recent.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Nenhuma transação neste mês"
              description="Toque no botão + para registrar a primeira."
            />
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
