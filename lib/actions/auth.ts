"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  message?: string;
};

function getRedirectTarget(formData: FormData) {
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
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  redirect(getRedirectTarget(formData));
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
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Este e-mail já está cadastrado." };
    }
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  // Se a confirmação por e-mail estiver desativada no projeto Supabase,
  // signUp já retorna uma sessão e podemos ir direto ao dashboard.
  if (data.session) {
    redirect("/dashboard");
  }

  return {
    message:
      "Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
