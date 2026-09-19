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

  return (
    <div className="bg-popover text-popover-foreground min-w-44 rounded-md border p-2.5 text-xs shadow-md">
      <p className="mb-2 font-medium capitalize">{label}</p>
      <dl className="numeric grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
        <dt className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: "var(--chart-income)" }}
          />
          Receitas
        </dt>
        <dd className="text-right">{formatCurrency(income)}</dd>

        <dt className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: "var(--chart-expense)" }}
          />
          Despesas
        </dt>
        <dd className="text-right">{formatCurrency(expense)}</dd>

        <dt className="text-muted-foreground border-t pt-1.5">Saldo</dt>
        <dd className="border-t pt-1.5 text-right font-medium">
          {formatCurrency(income - expense)}
        </dd>
      </dl>
    </div>
  );
}

export function MonthlyChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some((point) => point.income > 0 || point.expense > 0);

  if (!hasData) {
    return (
      <p className="text-muted-foreground flex h-48 items-center justify-center text-center text-sm">
        Registre transações para acompanhar a evolução dos meses.
      </p>
    );
  }

  return (
    <div>
      {/* Legenda sempre presente: identidade nunca depende só da cor. */}
      <div className="mb-5 flex items-center gap-4 text-[0.8125rem]">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: "var(--chart-income)" }}
          />
          Receitas
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: "var(--chart-expense)" }}
          />
          Despesas
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={2} margin={{ left: -20, right: 2 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={52}
            tickCount={4}
            tickFormatter={compact}
            tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: "var(--chart-grid)", fillOpacity: 0.5 }}
            content={<ChartTooltip />}
          />
          <Bar
            dataKey="income"
            fill="var(--chart-income)"
            radius={[3, 3, 0, 0]}
            maxBarSize={14}
          />
          <Bar
            dataKey="expense"
            fill="var(--chart-expense)"
            radius={[3, 3, 0, 0]}
            maxBarSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
