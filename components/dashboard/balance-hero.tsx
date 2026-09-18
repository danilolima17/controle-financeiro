import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

export function BalanceHero({
  balance,
  income,
  expense,
}: {
  balance: number;
  income: number;
  expense: number;
}) {
  return (
    <section className="bg-brand-gradient shadow-primary/25 relative overflow-hidden rounded-2xl p-6 text-white shadow-xl">
      {/* Brilhos decorativos */}
      <div className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-8 size-44 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        <p className="text-sm text-white/85">Saldo do mês</p>
        <p className="tabular mt-1.5 text-4xl font-semibold tracking-tight">
          {formatCurrency(balance)}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
            <dt className="flex items-center gap-1.5 text-xs text-white/80">
              <ArrowUpRight className="size-3.5" />
              Receitas
            </dt>
            <dd className="tabular mt-1 text-lg font-semibold">
              {formatCurrency(income)}
            </dd>
          </div>
          <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
            <dt className="flex items-center gap-1.5 text-xs text-white/80">
              <ArrowDownRight className="size-3.5" />
              Despesas
            </dt>
            <dd className="tabular mt-1 text-lg font-semibold">
              {formatCurrency(expense)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
