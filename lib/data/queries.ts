import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category, TransactionWithCategory } from "@/lib/types";

const DEFAULT_CATEGORIES = [
  { name: "Salário", type: "income", color: "#1baf7a", icon: "briefcase" },
  { name: "Freelance", type: "income", color: "#2a78d6", icon: "wallet" },
  { name: "Investimentos", type: "income", color: "#008300", icon: "piggy-bank" },
  { name: "Alimentação", type: "expense", color: "#eb6834", icon: "utensils" },
  { name: "Moradia", type: "expense", color: "#2a78d6", icon: "home" },
  { name: "Transporte", type: "expense", color: "#4a3aa7", icon: "car" },
  { name: "Saúde", type: "expense", color: "#e34948", icon: "heart-pulse" },
  { name: "Lazer", type: "expense", color: "#eda100", icon: "gamepad-2" },
  { name: "Compras", type: "expense", color: "#e87ba4", icon: "shopping-cart" },
] as const;

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Categorias do usuário. Na primeira visita a lista vem vazia e semeamos os
 * padrões aqui — antes isso era feito por um trigger em auth.users, que
 * derrubava o cadastro inteiro quando falhava.
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .returns<Category[]>();

  if (data && data.length > 0) return data;

  const { data: seeded } = await supabase
    .from("categories")
    .insert(
      DEFAULT_CATEGORIES.map((category) => ({
        ...category,
        user_id: user.id,
      }))
    )
    .select()
    .returns<Category[]>();

  return seeded ?? [];
}

export async function getTransactions(options?: {
  from?: string;
  to?: string;
  limit?: number;
  type?: "income" | "expense";
  categoryId?: string;
  search?: string;
}): Promise<TransactionWithCategory[]> {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*, category:categories(id, name, color, icon)")
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (options?.from) query = query.gte("occurred_on", options.from);
  if (options?.to) query = query.lte("occurred_on", options.to);
  if (options?.type) query = query.eq("type", options.type);
  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  if (options?.search) {
    // Escapa os curingas do LIKE para que a busca seja literal.
    const term = options.search.replace(/[%_\\]/g, (match) => `\\${match}`);
    query = query.ilike("description", `%${term}%`);
  }
  if (options?.limit) query = query.limit(options.limit);

  const { data } = await query.returns<TransactionWithCategory[]>();
  return data ?? [];
}
