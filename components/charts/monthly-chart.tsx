"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

export type MonthlyPoint = {
  label: string;
  income: number;
  expense: number;
};

function compact(value: number) {
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`;
  return String(Math.round(value));
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const income = payload.find((item) => item.dataKey === "income")?.value ?? 0;
  const expense = payload.find((item) => item.dataKey === "expense")?.value ?? 0;
  const balance = income - expense;

  return (
    <div className="bg-popover text-popover-foreground rounded-xl border p-3 text-xs shadow-lg">
      <p className="mb-2 font-medium">{label}</p>
      <dl className="tabular grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
        <dt className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: "var(--chart-income)" }}
          />
          Receitas
        </dt>
        <dd className="text-right font-medium">{formatCurrency(income)}</dd>
        <dt className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: "var(--chart-expense)" }}
          />
          Despesas
        </dt>
        <dd className="text-right font-medium">{formatCurrency(expense)}</dd>
        <dt className="text-muted-foreground border-t pt-1.5">Saldo</dt>
        <dd className="border-t pt-1.5 text-right font-semibold">
          {formatCurrency(balance)}
        </dd>
      </dl>
    </div>
  );
}

export function MonthlyChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some((point) => point.income > 0 || point.expense > 0);

  if (!hasData) {
    return (
      <div className="text-muted-foreground flex h-56 items-center justify-center text-center text-sm">
        Registre transações para ver a evolução dos seus meses.
      </div>
    );
  }

  return (
    <div>
      {/* Legenda: identidade nunca depende só da cor */}
      <div className="mb-4 flex items-center gap-4 text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--chart-income)" }}
          />
          Receitas
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--chart-expense)" }}
          />
          Despesas
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} margin={{ left: -18, right: 4 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--chart-grid)"
            strokeWidth={1}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={compact}
            tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: "var(--chart-grid)", fillOpacity: 0.35 }}
            content={<ChartTooltip />}
          />
          <Bar
            dataKey="income"
            fill="var(--chart-income)"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          />
          <Bar
            dataKey="expense"
            fill="var(--chart-expense)"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
