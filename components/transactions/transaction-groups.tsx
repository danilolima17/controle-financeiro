import type { Category, TransactionWithCategory } from "@/lib/types";
import { formatCurrency, formatDayHeading } from "@/lib/utils";
import { TransactionItem } from "@/components/transactions/transaction-item";

export function TransactionGroups({
  transactions,
  categories,
}: {
  transactions: TransactionWithCategory[];
  categories: Category[];
}) {
  const groups = new Map<string, TransactionWithCategory[]>();
  for (const transaction of transactions) {
    const list = groups.get(transaction.occurred_on) ?? [];
    list.push(transaction);
    groups.set(transaction.occurred_on, list);
  }

  return (
    <div className="flex flex-col gap-5">
      {[...groups.entries()].map(([day, items]) => {
        const dayTotal = items.reduce(
          (sum, item) =>
            item.type === "income" ? sum + item.amount : sum - item.amount,
          0
        );

        return (
          <section key={day}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 px-2">
              <h3 className="text-label text-muted-foreground truncate">
                {formatDayHeading(day)}
              </h3>
              <span className="numeric text-faint-foreground shrink-0 text-xs">
                {dayTotal >= 0 ? "+" : "−"}
                {formatCurrency(Math.abs(dayTotal))}
              </span>
            </div>

            <ul className="bg-card shadow-soft flex flex-col rounded-lg border p-1">
              {items.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  categories={categories}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
