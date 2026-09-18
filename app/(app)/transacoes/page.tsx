import type { Metadata } from "next";
import { Suspense } from "react";
import { Receipt } from "lucide-react";

import { getCategories, getTransactions } from "@/lib/data/queries";
import {
  currentMonthKey,
  formatCurrency,
  isValidMonthKey,
  monthRange,
} from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthSwitcher } from "@/components/dashboard/month-switcher";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionGroups } from "@/components/transactions/transaction-groups";

export const metadata: Metadata = {
  title: "Transações — Controle Financeiro",
};

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/transacoes">) {
  const params = await searchParams;
  const asString = (value: string | string[] | undefined) =>
    typeof value === "string" ? value : undefined;

  const monthKey = isValidMonthKey(asString(params.mes))
    ? asString(params.mes)!
    : currentMonthKey();
  const type = asString(params.tipo);
  const categoryId = asString(params.categoria);
  const search = asString(params.q);

  const { from, to } = monthRange(monthKey);

  const [categories, transactions] = await Promise.all([
    getCategories(),
    getTransactions({
      from,
      to,
      type: type === "income" || type === "expense" ? type : undefined,
      categoryId: categoryId && categoryId !== "todas" ? categoryId : undefined,
      search,
    }),
  ]);

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>

      <MonthSwitcher monthKey={monthKey} basePath="/transacoes" />

      <Suspense fallback={<Skeleton className="h-28 w-full" />}>
        <TransactionFilters categories={categories} />
      </Suspense>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="gap-0 py-3">
          <CardContent className="px-3">
            <p className="text-muted-foreground text-xs">Entradas</p>
            <p className="tabular text-income text-sm font-semibold">
              {formatCurrency(income)}
            </p>
          </CardContent>
        </Card>
        <Card className="gap-0 py-3">
          <CardContent className="px-3">
            <p className="text-muted-foreground text-xs">Saídas</p>
            <p className="tabular text-expense text-sm font-semibold">
              {formatCurrency(expense)}
            </p>
          </CardContent>
        </Card>
        <Card className="gap-0 py-3">
          <CardContent className="px-3">
            <p className="text-muted-foreground text-xs">Saldo</p>
            <p className="tabular text-sm font-semibold">
              {formatCurrency(income - expense)}
            </p>
          </CardContent>
        </Card>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-14 text-center">
          <span className="bg-accent text-primary flex size-12 items-center justify-center rounded-2xl">
            <Receipt className="size-5" />
          </span>
          <p className="text-muted-foreground text-sm">
            Nenhuma transação encontrada
            <br />
            para os filtros deste mês.
          </p>
        </div>
      ) : (
        <TransactionGroups
          transactions={transactions}
          categories={categories}
        />
      )}
    </div>
  );
}
