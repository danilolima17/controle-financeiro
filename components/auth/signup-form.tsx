"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { signup, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  if (state.message) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-success text-sm" role="status">
          {state.message}
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Ir para o login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Seu nome" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      {state.error && (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="animate-spin" />}
        Criar conta
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-foreground underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
