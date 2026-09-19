"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import type { Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";

const TYPES = [
  { value: "todos", label: "Tudo" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
] as const;

export function TransactionFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") ?? "";
  const currentType = searchParams.get("tipo") ?? "todos";
  const currentCategory = searchParams.get("categoria") ?? "todas";
  const [term, setTerm] = useState(currentSearch);

  function push(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "todos" || value === "todas") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Busca com atraso para não navegar a cada tecla.
  useEffect(() => {
    if (term === currentSearch) return;
    const timeout = setTimeout(() => push({ q: term || null }), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative">
        <Search className="text-faint-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar por descrição"
          className="pr-10 pl-10"
          aria-label="Buscar transações"
        />
        {term && (
          <button
            type="button"
            onClick={() => setTerm("")}
            aria-label="Limpar busca"
            className="text-faint-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-sm transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <SegmentedControl
          className="flex-1"
          size="lg"
          aria-label="Filtrar por tipo"
          options={TYPES}
          value={currentType as (typeof TYPES)[number]["value"]}
          onValueChange={(value) => push({ tipo: value })}
        />

        <Select
          value={currentCategory}
          onValueChange={(value) => push({ categoria: value })}
        >
          <SelectTrigger
            className="w-full shrink-0 sm:w-44"
            aria-label="Filtrar por categoria"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
