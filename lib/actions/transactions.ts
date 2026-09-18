"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { TransactionType } from "@/lib/types";

export type TransactionFormState = {
  error?: string;
};

function parseInput(formData: FormData) {
  const type = formData.get("type");
  const amountRaw = String(formData.get("amount") ?? "").replace(",", ".");
  const description = String(formData.get("description") ?? "").trim();
  const occurredOn = String(formData.get("occurred_on") ?? "");
  const categoryId = formData.get("category_id");

  if (type !== "income" && type !== "expense") {
    return { error: "Selecione o tipo da transação." } as const;
  }

  const amount = Number(amountRaw);
  if (!amountRaw || Number.isNaN(amount) || amount <= 0) {
    return { error: "Informe um valor válido maior que zero." } as const;
  }

  if (!description) {
    return { error: "Informe uma descrição." } as const;
  }

  if (!occurredOn) {
    return { error: "Informe a data da transação." } as const;
  }

  return {
    value: {
      type: type as TransactionType,
      amount,
      description,
      occurred_on: occurredOn,
      category_id:
        typeof categoryId === "string" && categoryId ? categoryId : null,
    },
  } as const;
}

export async function createTransaction(
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = parseInput(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("transactions")
    .insert({ ...parsed.value, user_id: user.id });

  if (error) return { error: "Não foi possível salvar a transação." };

  revalidatePath("/dashboard");
  return {};
}

export async function updateTransaction(
  id: string,
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = parseInput(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("transactions")
    .update(parsed.value)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Não foi possível atualizar a transação." };

  revalidatePath("/dashboard");
  return {};
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}
