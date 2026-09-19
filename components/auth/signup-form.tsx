"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, MailCheck } from "lucide-react";

import { signup, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  if (state.message) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-income-surface text-income flex size-12 items-center justify-center rounded-full">
          <MailCheck className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold">Confirme seu e-mail</h2>
          <p className="text-muted-foreground mt-1 text-sm">{state.message}</p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Ir para o login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="mb-1">
        <h2 className="text-[1.625rem] leading-9 font-semibold tracking-tight">
          Criar conta
        </h2>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Leva menos de um minuto.
        </p>
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
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
          <Label htmlFor="confirmPassword">Confirmar</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      {state.error && (
        <p
          className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="animate-spin" />}
        Criar conta
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
