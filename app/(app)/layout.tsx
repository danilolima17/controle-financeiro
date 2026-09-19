import { redirect } from "next/navigation";

import { getCategories } from "@/lib/data/queries";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/shell/bottom-nav";
import { SidebarBrand, SidebarNav } from "@/components/shell/sidebar";
import { TopBar } from "@/components/shell/top-bar";
import { UserMenu } from "@/components/shell/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const categories = await getCategories();
  const fullName =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Minha conta";

  return (
    <div className="flex min-h-full flex-1">
      {/* No desktop a navegação e a conta vivem na sidebar, e cada página
          traz o próprio cabeçalho — sem uma barra superior repetindo contexto. */}
      <aside className="bg-card hidden w-[15.5rem] shrink-0 flex-col border-r px-3 py-4 md:flex">
        <div className="px-1 pb-6">
          <SidebarBrand />
        </div>
        <SidebarNav />
        <div className="mt-auto flex items-center gap-1 border-t pt-3">
          <UserMenu name={fullName} email={user.email ?? ""} variant="row" />
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar email={user.email ?? ""} name={fullName} />

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-28 md:px-8 md:py-10 md:pb-14 xl:max-w-6xl">
          {children}
        </main>
      </div>

      <BottomNav categories={categories} />
    </div>
  );
}
