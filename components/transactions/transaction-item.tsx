"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteTransaction } from "@/lib/actions/transactions";
import { colorPair } from "@/lib/palette";
import type { Category, TransactionWithCategory } from "@/lib/types";
import { cn, formatCurrency, formatShortDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryIcon } from "@/components/category-icon";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";

export function TransactionItem({
  transaction,
  categories,
  showDate = false,
}: {
  transaction: TransactionWithCategory;
  categories: Category[];
  showDate?: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const isIncome = transaction.type === "income";
  const pair = colorPair(transaction.category?.color ?? "#2a78d6");

  return (
    <li className="hover:bg-accent/50 flex items-center gap-2.5 rounded-xl px-1 py-2.5 transition-colors sm:gap-3 sm:px-2">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white [background:var(--dot-light)] dark:[background:var(--dot-dark)] sm:size-10"
        style={
          {
            "--dot-light": pair.light,
            "--dot-dark": pair.dark,
          } as React.CSSProperties
        }
      >
        <CategoryIcon
          name={transaction.category?.icon ?? "tag"}
          className="size-4 sm:size-[18px]"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {transaction.description}
        </p>
        <p className="text-muted-foreground truncate text-xs">
          {transaction.category?.name ?? "Sem categoria"}
          {showDate && ` · ${formatShortDate(transaction.occurred_on)}`}
        </p>
      </div>

      <span
        className={cn(
          "tabular shrink-0 text-sm font-semibold",
          isIncome ? "text-income" : "text-expense"
        )}
      >
        {isIncome ? "+" : "−"}
        {formatCurrency(transaction.amount)}
      </span>

      <TransactionDialog
        categories={categories}
        transaction={transaction}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground size-7 shrink-0 sm:size-8"
          >
            <MoreVertical className="size-4" />
            <span className="sr-only">Ações da transação</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setEditOpen(true)}
          >
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{transaction.description}&rdquo; será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                startDelete(async () => {
                  await deleteTransaction(transaction.id);
                  setConfirmOpen(false);
                  toast.success("Transação excluída.");
                });
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
