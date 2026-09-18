import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Criar conta — Controle Financeiro",
};

export default function SignupPage() {
  return <SignupForm />;
}
