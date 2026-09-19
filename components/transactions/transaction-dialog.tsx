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
import { useIsMobile } from "@/lib/use-media-query";
import { cn, todayKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResponsiveModal } from "@/components/ui/responsive-modal";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CategoryIcon } from "@/components/category-icon";

const initialState: TransactionFormState = {};

const TYPE_OPTIONS = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
] as const;

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
  const Modal = useResponsiveModal();
  const isMobile = useIsMobile();

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
    <Modal.Root open={open} onOpenChange={setOpen}>
      {!isControlled && <Modal.Trigger asChild>{trigger}</Modal.Trigger>}

      <Modal.Content className="md:max-h-[92vh] md:max-w-md md:overflow-y-auto">
        <Modal.Header>
          <Modal.Title>
            {isEditing ? "Editar transação" : "Nova transação"}
          </Modal.Title>
          <Modal.Description>
            {isEditing
              ? "Atualize os dados desta transação."
              : "Registre uma receita ou despesa."}
          </Modal.Description>
        </Modal.Header>

        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="category_id" value={categoryId} />

          <SegmentedControl
            size="lg"
            tone="financial"
            aria-label="Tipo da transação"
            options={TYPE_OPTIONS}
            value={type}
            onValueChange={(value) => {
              setType(value);
              setCategoryId("");
            }}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Valor</Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-medium">
                R$
              </span>
              <Input
                id="amount"
                name="amount"
                inputMode="decimal"
                placeholder="0,00"
                defaultValue={transaction?.amount}
                className="numeric h-15 pl-12 text-[1.625rem] font-semibold"
                required
                // No celular o foco automático abriria o teclado por cima da
                // folha antes da pessoa ver o formulário.
                autoFocus={!isMobile}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
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

          <div className="flex flex-col gap-2.5">
            <Label>Categoria</Label>
            {visibleCategories.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhuma categoria de{" "}
                {type === "income" ? "receita" : "despesa"} cadastrada.
              </p>
            ) : (
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
                      style={
                        {
                          "--dot": pair.light,
                          "--dot-dark": pair.dark,
                        } as React.CSSProperties
                      }
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-150",
                        selected
                          ? "border-transparent [background:color-mix(in_oklab,var(--dot)_14%,transparent)] [color:var(--dot)] dark:[background:color-mix(in_oklab,var(--dot-dark)_26%,transparent)] dark:[color:var(--dot-dark)]"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <CategoryIcon
                        name={category.icon}
                        className="size-3.5 [color:var(--dot)] dark:[color:var(--dot-dark)]"
                      />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {state.error && (
            <p
              className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
              role="alert"
            >
              {state.error}
            </p>
          )}

          <Modal.Footer>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              {isEditing ? "Salvar alterações" : "Adicionar transação"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
