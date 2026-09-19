"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
    <li className="group hover:bg-secondary/60 flex items-center gap-3 rounded-md px-2 py-2 transition-colors duration-150">
      {/* Fundo tingido em vez de cor cheia: a lista fica calma e a cor
          continua identificando a categoria. */}
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full [background:color-mix(in_oklab,var(--dot)_13%,transparent)] [color:var(--dot)] dark:[background:color-mix(in_oklab,var(--dot-dark)_22%,transparent)] dark:[color:var(--dot-dark)]"
        style={
          {
            "--dot": pair.light,
            "--dot-dark": pair.dark,
          } as React.CSSProperties
        }
      >
        <CategoryIcon
          name={transaction.category?.icon ?? "tag"}
          className="size-[17px]"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{transaction.description}</p>
        <p className="text-muted-foreground truncate text-[0.8125rem]">
          {transaction.category?.name ?? "Sem categoria"}
          {showDate && ` · ${formatShortDate(transaction.occurred_on)}`}
        </p>
      </div>

      {/* Só a receita ganha cor; a despesa usa o sinal e a tinta normal. */}
      <span
        className={cn(
          "numeric shrink-0 text-sm font-medium",
          isIncome && "text-income"
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
            className="text-faint-foreground hover:text-foreground size-7 shrink-0"
          >
            <MoreHorizontal className="size-4" />
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
              className="bg-destructive text-destructive-foreground hover:brightness-110"
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
