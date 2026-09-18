"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { TransactionType } from "@/lib/types";

export type CategoryFormState = {
  error?: string;
};

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const type = formData.get("type");
  const color = String(formData.get("color") ?? "#6366f1");

  if (!name) return { error: "Informe um nome para a categoria." };
  if (type !== "income" && type !== "expense") {
    return { error: "Selecione o tipo da categoria." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    type: type as TransactionType,
    color,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe uma categoria com esse nome e tipo." };
    }
    return { error: "Não foi possível criar a categoria." };
  }

  revalidatePath("/dashboard");
  return {};
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

  revalidatePath("/dashboard");
}
