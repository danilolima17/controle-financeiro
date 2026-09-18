"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import {
  createTransaction,
  updateTransaction,
  type TransactionFormState,
} from "@/lib/actions/transactions";
import type { Category, TransactionType, TransactionWithCategory } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: TransactionFormState = {};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

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
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  );
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      setOpen(false);
    }
    wasPending.current = isPending;
  }, [isPending, state, setOpen]);

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button size="sm">
              <Plus />
              Nova transação
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da transação."
              : "Registre uma nova receita ou despesa."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              name="type"
              value={type}
              onValueChange={(value) => setType(value as TransactionType)}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                inputMode="decimal"
                defaultValue={transaction?.amount}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="occurred_on">Data</Label>
              <Input
                id="occurred_on"
                name="occurred_on"
                type="date"
                defaultValue={transaction?.occurred_on ?? todayISO()}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              placeholder="Ex: Supermercado"
              defaultValue={transaction?.description}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category_id">Categoria</Label>
            <Select
              name="category_id"
              defaultValue={transaction?.category_id ?? undefined}
            >
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Sem categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state.error && (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isEditing ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
