import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar — Controle Financeiro",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { redirectTo } = await searchParams;

  return (
    <LoginForm
      redirectTo={typeof redirectTo === "string" ? redirectTo : undefined}
    />
  );
}
