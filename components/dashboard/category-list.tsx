"use client";

import { X } from "lucide-react";

import { deleteCategory } from "@/lib/actions/categories";
import type { Category } from "@/lib/types";
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

export function CategoryList({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhuma categoria cadastrada.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <AlertDialog key={category.id}>
          <Badge
            variant="outline"
            className="gap-1.5 py-1 pr-1 pl-2.5"
            style={{ borderColor: category.color, color: category.color }}
          >
            {category.name}
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="hover:bg-foreground/10 rounded-full p-0.5"
                aria-label={`Excluir categoria ${category.name}`}
              >
                <X className="size-3" />
              </button>
            </AlertDialogTrigger>
          </Badge>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir &ldquo;{category.name}
                &rdquo;? Transações associadas ficarão sem categoria.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <form action={deleteCategory.bind(null, category.id)}>
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
      ))}
    </div>
  );
}
