import type { Metadata } from "next";
import { LogOut, Smartphone } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { getCategories, getTransactions } from "@/lib/data/queries";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InstallButton } from "@/components/pwa/install-button";
import { ThemeSelector } from "@/components/settings/theme-selector";

export const metadata: Metadata = {
  title: "Ajustes — Controle Financeiro",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [categories, transactions] = await Promise.all([
    getCategories(),
    getTransactions(),
  ]);

  const email = user?.email ?? "";
  const name = (user?.user_metadata?.full_name as string | undefined) ?? email;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Ajustes</h1>

      <Card>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-brand-gradient text-lg font-semibold text-white">
              {(name || email).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{name}</p>
            <p className="text-muted-foreground truncate text-sm">{email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="gap-1 py-4">
          <CardContent>
            <p className="text-2xl font-semibold">{transactions.length}</p>
            <p className="text-muted-foreground text-xs">
              transações registradas
            </p>
          </CardContent>
        </Card>
        <Card className="gap-1 py-4">
          <CardContent>
            <p className="text-2xl font-semibold">{categories.length}</p>
            <p className="text-muted-foreground text-xs">categorias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aparência</CardTitle>
          <CardDescription>
            Escolha o tema do app ou acompanhe o do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="size-4" />
            Instalar no celular
          </CardTitle>
          <CardDescription>
            Instale o Controle Financeiro para abrir em tela cheia, como um app
            nativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InstallButton />
        </CardContent>
      </Card>

      <form action={logout}>
        <Button
          type="submit"
          variant="outline"
          className="text-destructive hover:text-destructive w-full"
        >
          <LogOut />
          Sair da conta
        </Button>
      </form>
    </div>
  );
}
