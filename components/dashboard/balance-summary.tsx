import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { cn, formatCurrency, formatMonthName, shiftMonth } from "@/lib/utils";
import { MonthSwitcher } from "@/components/dashboard/month-switcher";

/**
 * O saldo é o momento de marca do app: é o único lugar com gradiente, e é
 * onde o número aparece grande o bastante para ser lido de longe.
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
    <section className="bg-hero text-hero-ink shadow-soft relative overflow-hidden rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-label text-hero-ink-soft">Saldo do mês</p>
        <MonthSwitcher monthKey={monthKey} basePath="/dashboard" tone="hero" />
      </div>

      <p className="text-display mt-3 text-[2.375rem] font-bold md:text-[2.75rem]">
        {formatCurrency(balance)}
      </p>

      {delta !== null && (
        <p className="mt-2.5 flex items-center gap-2 text-[0.8125rem]">
          <span className="glass inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold">
            {improved ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {improved ? "+" : ""}
            {delta.toFixed(0)}%
          </span>
          <span className="text-hero-ink-soft">
            vs. {formatMonthName(shiftMonth(monthKey, -1))}
          </span>
        </p>
      )}

      {/* Em tela larga as duas pills não precisam acompanhar a largura
          inteira do cartão: ficariam quase vazias. */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:max-w-lg">
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
  const Icon = tone === "income" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="glass rounded-xl px-3.5 py-3">
      <p className="text-hero-ink-soft flex items-center gap-1.5 text-[0.8125rem] font-medium">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p
        className={cn(
          "numeric mt-1 text-[1.0625rem] font-bold md:text-lg"
        )}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}
