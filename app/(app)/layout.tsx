import { redirect } from "next/navigation";

import { getCategories } from "@/lib/data/queries";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/shell/bottom-nav";
import { Sidebar } from "@/components/shell/sidebar";
import { TopBar } from "@/components/shell/top-bar";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const categories = await getCategories();
  const name =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "";

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar email={user.email ?? ""} name={name} />

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-5 pb-28 md:px-8 md:pb-10">
          {children}
        </main>
      </div>

      <BottomNav categories={categories} />
    </div>
  );
}
