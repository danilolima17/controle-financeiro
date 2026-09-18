"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { deleteTransaction } from "@/lib/actions/transactions";
import type { Category, TransactionWithCategory } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionDialog } from "@/components/dashboard/transaction-dialog";

export function TransactionList({
  transactions,
  categories,
}: {
  transactions: TransactionWithCategory[];
  categories: Category[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed py-12 text-center text-sm">
        Nenhuma transação registrada ainda.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">
              {transaction.description}
            </TableCell>
            <TableCell>
              {transaction.category ? (
                <Badge
                  variant="outline"
                  style={{
                    borderColor: transaction.category.color,
                    color: transaction.category.color,
                  }}
                >
                  {transaction.category.name}
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(transaction.occurred_on)}
            </TableCell>
            <TableCell
              className={
                "text-right font-medium " +
                (transaction.type === "income"
                  ? "text-success"
                  : "text-destructive")
              }
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell>
              <RowActions
                transaction={transaction}
                categories={categories}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function RowActions({
  transaction,
  categories,
}: {
  transaction: TransactionWithCategory;
  categories: Category[];
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <AlertDialog>
      <TransactionDialog
        categories={categories}
        transaction={transaction}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setEditOpen(true)}
          >
            Editar
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
            >
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir &ldquo;{transaction.description}
            &rdquo;? Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteTransaction.bind(null, transaction.id)}>
            <AlertDialogAction
              type="submit"
              className="bg-destructive hover:bg-destructive/90 w-full"
            >
              Excluir
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
