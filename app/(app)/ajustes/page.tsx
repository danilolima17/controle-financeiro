import type { Metadata } from "next";
import { LogOut, Smartphone } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { getCategories, getTransactions } from "@/lib/data/queries";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { InstallButton } from "@/components/pwa/install-button";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { initialsOf } from "@/components/shell/user-menu";

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
  const name =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    email.split("@")[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Ajustes" />

      <section className="bg-card rounded-lg border">
        <div className="flex items-center gap-3.5 px-4 py-4">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {initialsOf(name || email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{name}</p>
            <p className="text-muted-foreground truncate text-sm">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x border-t">
          <div className="px-4 py-3">
            <p className="numeric text-lg font-semibold">
              {transactions.length}
            </p>
            <p className="text-muted-foreground text-[0.8125rem]">
              transações
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="numeric text-lg font-semibold">{categories.length}</p>
            <p className="text-muted-foreground text-[0.8125rem]">categorias</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <SectionHeader title="Aparência" />
        <ThemeSelector />
      </section>

      <section className="flex flex-col gap-2.5">
        <SectionHeader title="Aplicativo" />
        <div className="bg-card rounded-lg border px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="bg-surface-sunken text-muted-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
              <Smartphone className="size-[17px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Instalar no celular</p>
              <p className="text-muted-foreground mt-0.5 text-[0.8125rem]">
                Abra em tela cheia, como um aplicativo nativo.
              </p>
              <div className="mt-3">
                <InstallButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <form action={logout}>
        <Button
          type="submit"
          variant="outline"
          className="text-destructive hover:text-destructive hover:bg-destructive/5 w-full"
        >
          <LogOut />
          Sair da conta
        </Button>
      </form>
    </div>
  );
}
