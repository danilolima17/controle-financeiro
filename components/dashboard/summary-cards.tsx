import { ArrowDownCircle, ArrowUpCircle, Scale } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryCards({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) {
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Receitas
          </CardTitle>
          <ArrowUpCircle className="text-success size-4" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatCurrency(income)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Despesas
          </CardTitle>
          <ArrowDownCircle className="text-destructive size-4" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatCurrency(expense)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Saldo
          </CardTitle>
          <Scale className="size-4" />
        </CardHeader>
        <CardContent>
          <p
            className={
              "text-2xl font-semibold " +
              (balance >= 0 ? "text-success" : "text-destructive")
            }
          >
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
