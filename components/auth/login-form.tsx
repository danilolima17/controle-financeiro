"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { login, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="mb-1">
        <h2 className="text-[1.625rem] leading-9 font-semibold tracking-tight">
          Bem-vindo de volta
        </h2>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Entre para acompanhar suas finanças.
        </p>
      </div>

      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

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
          autoComplete="current-password"
          required
        />
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
        Entrar
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Não tem uma conta?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
