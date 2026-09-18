import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Entrar — Controle Financeiro",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { redirectTo } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre com sua conta para acessar seu controle financeiro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            redirectTo={
              typeof redirectTo === "string" ? redirectTo : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
