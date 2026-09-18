"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import {
  createCategory,
  type CategoryFormState,
} from "@/lib/actions/categories";
import type { TransactionType } from "@/lib/types";
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

const initialState: CategoryFormState = {};

const PRESET_COLORS = [
  "#22c55e",
  "#0ea5e9",
  "#a855f7",
  "#f97316",
  "#ef4444",
  "#eab308",
  "#6366f1",
  "#64748b",
];

export function CategoryDialog({
  defaultType = "expense",
}: {
  defaultType?: TransactionType;
}) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [state, formAction, isPending] = useActionState(
    createCategory,
    initialState
  );
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      setOpen(false);
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus />
          Nova categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Categorias ajudam a organizar suas receitas e despesas.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name">Nome</Label>
            <Input
              id="cat-name"
              name="name"
              placeholder="Ex: Assinaturas"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-type">Tipo</Label>
            <Select name="type" defaultValue={defaultType}>
              <SelectTrigger id="cat-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cor</Label>
            <input type="hidden" name="color" value={color} />
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  className={
                    "size-6 rounded-full ring-offset-2 outline-none " +
                    (color === preset ? "ring-2 ring-ring" : "")
                  }
                  style={{ backgroundColor: preset }}
                  aria-label={`Selecionar cor ${preset}`}
                />
              ))}
            </div>
          </div>

          {state.error && (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
