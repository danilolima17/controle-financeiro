import type { Metadata } from "next";
import { Suspense } from "react";
import { Receipt, SearchX } from "lucide-react";

import { getCategories, getTransactions } from "@/lib/data/queries";
import {
  cn,
  currentMonthKey,
  formatCurrency,
  isValidMonthKey,
  monthRange,
} from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
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

  const requested = asString(params.mes);
  const monthKey = isValidMonthKey(requested) ? requested : currentMonthKey();
  const type = asString(params.tipo);
  const categoryId = asString(params.categoria);
  const search = asString(params.q);
  const isFiltered = Boolean(
    search || (type && type !== "todos") || (categoryId && categoryId !== "todas")
  );

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
      <PageHeader
        title="Transações"
        description={`${transactions.length} ${
          transactions.length === 1 ? "lançamento" : "lançamentos"
        } no período`}
      />

      <MonthSwitcher monthKey={monthKey} basePath="/transacoes" />

      <Suspense fallback={<Skeleton className="h-[6.5rem] w-full rounded-lg" />}>
        <TransactionFilters categories={categories} />
      </Suspense>

      {/* Um card só com divisores: três cards lado a lado não cabem em 320px. */}
      <div className="bg-card shadow-soft grid grid-cols-3 divide-x rounded-lg border">
        <Figure label="Entradas" value={income} tone="income" />
        <Figure label="Saídas" value={expense} tone="expense" />
        <Figure label="Saldo" value={income - expense} />
      </div>

      {transactions.length === 0 ? (
        <div className="bg-card shadow-soft rounded-lg border">
          {isFiltered ? (
            <EmptyState
              icon={SearchX}
              title="Nada encontrado"
              description="Nenhuma transação corresponde aos filtros deste mês."
            />
          ) : (
            <EmptyState
              icon={Receipt}
              title="Nenhuma transação neste mês"
              description="Toque no botão + para registrar a primeira."
            />
          )}
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

function Figure({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "income" | "expense";
}) {
  return (
    <div className="min-w-0 px-3 py-3 text-center">
      <p className="text-muted-foreground truncate text-xs">{label}</p>
      <p
        className={cn(
          "numeric mt-0.5 truncate text-sm font-semibold",
          tone === "income" && "text-income",
          tone === "expense" && "text-expense"
        )}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}
