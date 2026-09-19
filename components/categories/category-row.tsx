"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { deleteCategory } from "@/lib/actions/categories";
import { colorPair } from "@/lib/palette";
import type { Category } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
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
import { Progress } from "@/components/ui/progress";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryDialog } from "@/components/categories/category-dialog";

export function CategoryRow({
  category,
  spent,
}: {
  category: Category;
  spent: number;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const pair = colorPair(category.color);
  const budget = category.monthly_budget ? Number(category.monthly_budget) : null;
  const ratio = budget ? spent / budget : 0;
  const exceeded = budget !== null && spent > budget;

  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full [background:color-mix(in_oklab,var(--dot)_13%,transparent)] [color:var(--dot)] dark:[background:color-mix(in_oklab,var(--dot-dark)_22%,transparent)] dark:[color:var(--dot-dark)]"
          style={
            {
              "--dot": pair.light,
              "--dot-dark": pair.dark,
            } as React.CSSProperties
          }
        >
          <CategoryIcon name={category.icon} className="size-[17px]" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{category.name}</p>
          <p className="text-muted-foreground truncate text-[0.8125rem]">
            {budget
              ? `Limite de ${formatCurrency(budget)}`
              : "Sem limite definido"}
          </p>
        </div>

        <span className="numeric shrink-0 text-sm font-medium">
          {formatCurrency(spent)}
        </span>

        <CategoryDialog
          category={category}
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
              <span className="sr-only">Ações da categoria</span>
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
      </div>

      {budget !== null && (
        <div className="mt-2.5 flex items-center gap-2.5">
          <Progress
            value={Math.min(ratio * 100, 100)}
            className="h-1.5"
            aria-label={`${Math.round(ratio * 100)}% do limite`}
            indicatorStyle={{
              background: exceeded ? "var(--expense)" : pair.light,
            }}
          />
          <span
            className={cn(
              "numeric shrink-0 text-xs",
              exceeded ? "text-expense font-medium" : "text-faint-foreground"
            )}
          >
            {exceeded && <TriangleAlert className="mr-1 inline size-3" />}
            {Math.round(ratio * 100)}%
          </span>
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{category.name}&rdquo; será removida e as transações
              ligadas a ela ficarão sem categoria.
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
                  await deleteCategory(category.id);
                  setConfirmOpen(false);
                  toast.success("Categoria excluída.");
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
