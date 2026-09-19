import { TrendingDown, TrendingUp } from "lucide-react";

import { cn, formatCurrency, formatMonthName, shiftMonth } from "@/lib/utils";
import { MonthSwitcher } from "@/components/dashboard/month-switcher";

/**
 * O número que a pessoa vem ver. Sem cartão colorido: quem carrega a
 * hierarquia é o tamanho do valor e o silêncio ao redor dele.
 */
export function BalanceSummary({
  monthKey,
  income,
  expense,
  previousBalance,
}: {
  monthKey: string;
  income: number;
  expense: number;
  previousBalance: number | null;
}) {
  const balance = income - expense;

  // Só compara quando o mês anterior tem base para comparação.
  const delta =
    previousBalance !== null && previousBalance !== 0
      ? ((balance - previousBalance) / Math.abs(previousBalance)) * 100
      : null;
  const improved = delta !== null && delta >= 0;

  return (
    <section className="bg-card rounded-lg border">
      <div className="px-4 pt-4 md:px-5 md:pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-label text-muted-foreground">Saldo do mês</p>
          <MonthSwitcher monthKey={monthKey} basePath="/dashboard" />
        </div>

        <div>
          <p
            className={cn(
              "text-display mt-2 text-[2.125rem] font-semibold md:text-[2.5rem]",
              balance < 0 && "text-expense"
            )}
          >
            {formatCurrency(balance)}
          </p>

          {delta !== null && (
            <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem]">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium",
                  improved
                    ? "bg-income-surface text-income"
                    : "bg-expense-surface text-expense"
                )}
              >
                {improved ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <TrendingDown className="size-3.5" />
                )}
                {improved ? "+" : ""}
                {delta.toFixed(0)}%
              </span>
              <span className="text-muted-foreground">
                vs. {formatMonthName(shiftMonth(monthKey, -1))}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 divide-x border-t">
        <Figure label="Receitas" value={income} tone="income" />
        <Figure label="Despesas" value={expense} tone="expense" />
      </div>

    </section>
  );
}

function Figure({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "income" | "expense";
}) {
  return (
    <div className="px-4 py-3.5 md:px-5">
      <p className="text-muted-foreground flex items-center gap-1.5 text-[0.8125rem]">
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            tone === "income" ? "bg-income" : "bg-expense"
          )}
        />
        {label}
      </p>
      <p className="numeric mt-1 text-[1.0625rem] font-semibold">
        {formatCurrency(value)}
      </p>
    </div>
  );
}
