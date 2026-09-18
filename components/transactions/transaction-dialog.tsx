"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  createTransaction,
  updateTransaction,
  type TransactionFormState,
} from "@/lib/actions/transactions";
import { colorPair } from "@/lib/palette";
import type {
  Category,
  TransactionType,
  TransactionWithCategory,
} from "@/lib/types";
import { cn, todayKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "@/components/category-icon";

const initialState: TransactionFormState = {};

export function TransactionDialog({
  categories,
  transaction,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  categories: Category[];
  transaction?: TransactionWithCategory;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isEditing = Boolean(transaction);
  const action = isEditing
    ? updateTransaction.bind(null, transaction!.id)
    : createTransaction;

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange! : setUncontrolledOpen;

  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "expense"
  );
  const [categoryId, setCategoryId] = useState<string>(
    transaction?.category_id ?? ""
  );
  const [state, formAction, isPending] = useActionState(action, initialState);
  const lastSavedAt = useRef(state.savedAt);

  useEffect(() => {
    if (state.savedAt && state.savedAt !== lastSavedAt.current) {
      lastSavedAt.current = state.savedAt;
      setOpen(false);
      toast.success(
        isEditing ? "Transação atualizada." : "Transação adicionada."
      );
    }
  }, [state.savedAt, isEditing, setOpen]);

  const visibleCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados desta transação."
              : "Registre uma receita ou despesa."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="category_id" value={categoryId} />

          {/* Seletor de tipo */}
          <div className="bg-secondary grid grid-cols-2 gap-1 rounded-xl p-1">
            {(
              [
                { value: "expense", label: "Despesa" },
                { value: "income", label: "Receita" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setType(option.value);
                  setCategoryId("");
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  type === option.value
                    ? option.value === "income"
                      ? "bg-income text-white shadow-sm"
                      : "bg-expense text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Valor</Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 text-lg font-medium">
                R$
              </span>
              <Input
                id="amount"
                name="amount"
                inputMode="decimal"
                placeholder="0,00"
                defaultValue={transaction?.amount}
                className="tabular h-16 pl-12 text-2xl font-semibold"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                placeholder="Mercado"
                defaultValue={transaction?.description}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="occurred_on">Data</Label>
              <Input
                id="occurred_on"
                name="occurred_on"
                type="date"
                defaultValue={transaction?.occurred_on ?? todayKey()}
                required
              />
            </div>
          </div>

          {/* Categorias como chips */}
          <div className="flex flex-col gap-2">
            <Label>Categoria</Label>
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((category) => {
                const pair = colorPair(category.color);
                const selected = categoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setCategoryId(selected ? "" : category.id)
                    }
                    aria-pressed={selected}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      selected
                        ? "border-transparent text-white [background:var(--chip-light)] dark:[background:var(--chip-dark)]"
                        : "hover:bg-accent"
                    )}
                    style={
                      {
                        "--chip-light": pair.light,
                        "--chip-dark": pair.dark,
                      } as React.CSSProperties
                    }
                  >
                    <CategoryIcon
                      name={category.icon}
                      className={cn(
                        "size-3.5",
                        !selected &&
                          "[color:var(--chip-light)] dark:[color:var(--chip-dark)]"
                      )}
                    />
                    {category.name}
                  </button>
                );
              })}
              {visibleCategories.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Nenhuma categoria de {type === "income" ? "receita" : "despesa"}.
                  Crie uma na aba Categorias.
                </p>
              )}
            </div>
          </div>

          {state.error && (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              {isEditing ? "Salvar alterações" : "Adicionar transação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
