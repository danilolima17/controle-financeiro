"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteCategory } from "@/lib/actions/categories";
import { colorPair } from "@/lib/palette";
import type { Category } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
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

export function CategoryCard({
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
  const exceeded = budget !== null && spent > budget;

  return (
    <div className="bg-card flex flex-col gap-3 rounded-2xl border p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white [background:var(--c-light)] dark:[background:var(--c-dark)]"
          style={
            {
              "--c-light": pair.light,
              "--c-dark": pair.dark,
            } as React.CSSProperties
          }
        >
          <CategoryIcon name={category.icon} className="size-[18px]" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{category.name}</p>
          <p className="tabular text-muted-foreground text-xs">
            {formatCurrency(spent)} neste mês
          </p>
        </div>

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
              className="text-muted-foreground shrink-0"
            >
              <MoreVertical className="size-4" />
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
        <div className="flex flex-col gap-1.5">
          <Progress
            value={Math.min((spent / budget) * 100, 100)}
            indicatorStyle={{
              background: exceeded ? "var(--expense)" : pair.light,
            }}
          />
          <p className="text-muted-foreground text-xs">
            {exceeded ? "Estourou o limite de " : "Limite de "}
            <span className="tabular font-medium">
              {formatCurrency(budget)}
            </span>
          </p>
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{category.name}&rdquo; será removida e as transações ligadas
              a ela ficarão sem categoria.
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
    </div>
  );
}
