"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  createCategory,
  updateCategory,
  type CategoryFormState,
} from "@/lib/actions/categories";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/palette";
import type { Category, TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
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

const initialState: CategoryFormState = {};

export function CategoryDialog({
  category,
  defaultType = "expense",
  trigger,
  open: openProp,
  onOpenChange,
}: {
  category?: Category;
  defaultType?: TransactionType;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isEditing = Boolean(category);
  const action = isEditing
    ? updateCategory.bind(null, category!.id)
    : createCategory;

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange! : setUncontrolledOpen;

  const [type, setType] = useState<TransactionType>(
    category?.type ?? defaultType
  );
  const [color, setColor] = useState(
    category?.color ?? CATEGORY_COLORS[0].light
  );
  const [icon, setIcon] = useState(category?.icon ?? "tag");
  const [state, formAction, isPending] = useActionState(action, initialState);
  const lastSavedAt = useRef(state.savedAt);

  useEffect(() => {
    if (state.savedAt && state.savedAt !== lastSavedAt.current) {
      lastSavedAt.current = state.savedAt;
      setOpen(false);
      toast.success(isEditing ? "Categoria atualizada." : "Categoria criada.");
    }
  }, [state.savedAt, isEditing, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            Escolha um nome, um ícone e uma cor para identificar a categoria.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="color" value={color} />
          <input type="hidden" name="icon" value={icon} />

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
                onClick={() => setType(option.value)}
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name">Nome</Label>
            <Input
              id="cat-name"
              name="name"
              placeholder="Assinaturas"
              defaultValue={category?.name}
              required
            />
          </div>

          {type === "expense" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="monthly_budget">
                Orçamento mensal{" "}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                  R$
                </span>
                <Input
                  id="monthly_budget"
                  name="monthly_budget"
                  inputMode="decimal"
                  placeholder="0,00"
                  defaultValue={category?.monthly_budget ?? ""}
                  className="tabular pl-9"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((option) => (
                <button
                  key={option.light}
                  type="button"
                  onClick={() => setColor(option.light)}
                  aria-label={`Cor ${option.name}`}
                  aria-pressed={color === option.light}
                  className="flex size-9 items-center justify-center rounded-full text-white transition-transform active:scale-90 [background:var(--sw-light)] dark:[background:var(--sw-dark)]"
                  style={
                    {
                      "--sw-light": option.light,
                      "--sw-dark": option.dark,
                    } as React.CSSProperties
                  }
                >
                  {color === option.light && <Check className="size-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ICONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIcon(option)}
                  aria-label={`Ícone ${option}`}
                  aria-pressed={icon === option}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl border transition-colors",
                    icon === option
                      ? "border-primary bg-accent text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <CategoryIcon name={option} className="size-4" />
                </button>
              ))}
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
              {isEditing ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
