import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Criar conta — Controle Financeiro",
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Criar conta</CardTitle>
          <CardDescription>
            Comece a organizar suas finanças em minutos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
