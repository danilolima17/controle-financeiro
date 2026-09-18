"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  message?: string;
};

function friendlyError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  }
  if (normalized.includes("already registered")) {
    return "Este e-mail já está cadastrado.";
  }
  if (normalized.includes("database error")) {
    return "Erro no banco de dados ao criar o usuário. Rode o arquivo supabase/schema.sql no SQL Editor do seu projeto — ele remove o trigger antigo que causava esse erro.";
  }
  if (normalized.includes("invalid api key") || normalized.includes("no api key")) {
    return "Chave do Supabase inválida. Confira NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.";
  }
  if (normalized.includes("fetch failed")) {
    return "Não foi possível conectar ao Supabase. Confira a URL do projeto e sua conexão.";
  }
  return message;
}

async function origin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

function safeRedirectTarget(formData: FormData) {
  const redirectTo = formData.get("redirectTo");
  if (typeof redirectTo === "string" && redirectTo.startsWith("/")) {
    return redirectTo;
  }
  return "/dashboard";
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: friendlyError(error.message) };
  }

  redirect(safeRedirectTarget(formData));
}

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password) {
    return { error: "Preencha todos os campos." };
  }
  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${await origin()}/auth/confirm`,
    },
  });

  if (error) {
    return { error: friendlyError(error.message) };
  }

  // Projetos com confirmação de e-mail desativada já devolvem uma sessão.
  if (data.session) {
    redirect("/dashboard");
  }

  return {
    message:
      "Conta criada! Enviamos um e-mail de confirmação — confirme o cadastro para entrar.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
