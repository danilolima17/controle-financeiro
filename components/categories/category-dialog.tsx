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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResponsiveModal } from "@/components/ui/responsive-modal";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CategoryIcon } from "@/components/category-icon";

const initialState: CategoryFormState = {};

const TYPE_OPTIONS = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
] as const;

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
  const Modal = useResponsiveModal();

  useEffect(() => {
    if (state.savedAt && state.savedAt !== lastSavedAt.current) {
      lastSavedAt.current = state.savedAt;
      setOpen(false);
      toast.success(isEditing ? "Categoria atualizada." : "Categoria criada.");
    }
  }, [state.savedAt, isEditing, setOpen]);

  const selectedPair =
    CATEGORY_COLORS.find((option) => option.light === color) ??
    CATEGORY_COLORS[0];

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      {!isControlled && <Modal.Trigger asChild>{trigger}</Modal.Trigger>}

      <Modal.Content className="md:max-h-[92vh] md:max-w-md md:overflow-y-auto">
        <Modal.Header>
          <Modal.Title>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </Modal.Title>
          <Modal.Description>
            Escolha um nome, um ícone e uma cor para identificar a categoria.
          </Modal.Description>
        </Modal.Header>

        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="color" value={color} />
          <input type="hidden" name="icon" value={icon} />

          <SegmentedControl
            size="lg"
            tone="financial"
            aria-label="Tipo da categoria"
            options={TYPE_OPTIONS}
            value={type}
            onValueChange={setType}
          />

          {/* Prévia: mostra o resultado das escolhas abaixo. */}
          <div className="bg-surface-sunken flex items-center gap-3 rounded-lg px-3.5 py-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full [background:color-mix(in_oklab,var(--dot)_14%,transparent)] [color:var(--dot)] dark:[background:color-mix(in_oklab,var(--dot-dark)_24%,transparent)] dark:[color:var(--dot-dark)]"
              style={
                {
                  "--dot": selectedPair.light,
                  "--dot-dark": selectedPair.dark,
                } as React.CSSProperties
              }
            >
              <CategoryIcon name={icon} className="size-[18px]" />
            </span>
            <p className="text-muted-foreground text-[0.8125rem]">
              Prévia da categoria
            </p>
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
                <span className="text-faint-foreground font-normal">
                  opcional
                </span>
              </Label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2 text-sm">
                  R$
                </span>
                <Input
                  id="monthly_budget"
                  name="monthly_budget"
                  inputMode="decimal"
                  placeholder="0,00"
                  defaultValue={category?.monthly_budget ?? ""}
                  className="numeric pl-10"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((option) => (
                <button
                  key={option.light}
                  type="button"
                  onClick={() => setColor(option.light)}
                  aria-label={`Cor ${option.name}`}
                  aria-pressed={color === option.light}
                  className="flex size-8 items-center justify-center rounded-full text-white transition-transform duration-150 active:scale-90 [background:var(--sw-light)] dark:[background:var(--sw-dark)]"
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

          <div className="flex flex-col gap-2.5">
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
                    "flex size-9 items-center justify-center rounded-md border transition-colors duration-150",
                    icon === option
                      ? "border-primary text-primary bg-accent"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <CategoryIcon name={option} className="size-4" />
                </button>
              ))}
            </div>
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
              {isEditing ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
