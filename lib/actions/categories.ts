"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { TransactionType } from "@/lib/types";
import { parseAmount } from "@/lib/utils";

export type CategoryFormState = {
  error?: string;
  savedAt?: number;
};

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
  revalidatePath("/categorias");
}

function parseInput(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = formData.get("type");
  const color = String(formData.get("color") ?? "#2a78d6");
  const icon = String(formData.get("icon") ?? "tag");
  const budgetRaw = String(formData.get("monthly_budget") ?? "").trim();

  if (!name) return { error: "Informe um nome para a categoria." } as const;
  if (type !== "income" && type !== "expense") {
    return { error: "Selecione o tipo da categoria." } as const;
  }

  let monthlyBudget: number | null = null;
  if (budgetRaw) {
    const parsed = parseAmount(budgetRaw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { error: "Orçamento inválido." } as const;
    }
    monthlyBudget = parsed;
  }

  return {
    value: {
      name,
      type: type as TransactionType,
      color,
      icon,
      monthly_budget: monthlyBudget,
    },
  } as const;
}

function duplicateMessage(code: string | undefined) {
  return code === "23505"
    ? "Já existe uma categoria com esse nome e tipo."
    : null;
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const parsed = parseInput(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("categories")
    .insert({ ...parsed.value, user_id: user.id });

  if (error) {
    return { error: duplicateMessage(error.code) ?? error.message };
  }

  revalidateAll();
  return { savedAt: Date.now() };
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const parsed = parseInput(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("categories")
    .update(parsed.value)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: duplicateMessage(error.code) ?? error.message };
  }

  revalidateAll();
  return { savedAt: Date.now() };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidateAll();
}
