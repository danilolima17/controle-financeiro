import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import type { Category, TransactionWithCategory } from "@/lib/types";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TransactionDialog } from "@/components/dashboard/transaction-dialog";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { CategoryDialog } from "@/components/dashboard/category-dialog";
import { CategoryList } from "@/components/dashboard/category-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Dashboard — Controle Financeiro",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: transactions }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .returns<Category[]>(),
    supabase
      .from("transactions")
      .select("*, category:categories(id, name, color)")
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<TransactionWithCategory[]>(),
  ]);

  const allCategories = categories ?? [];
  const allTransactions = transactions ?? [];

  const income = allTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeCategories = allCategories.filter((c) => c.type === "income");
  const expenseCategories = allCategories.filter((c) => c.type === "expense");

  return (
    <div className="flex flex-col gap-8">
      <SummaryCards income={income} expense={expense} />

      <Tabs defaultValue="transactions">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="transactions" className="flex flex-col gap-4">
          <div className="flex justify-end">
            <TransactionDialog categories={allCategories} />
          </div>
          <Card>
            <CardContent>
              <TransactionList
                transactions={allTransactions}
                categories={allCategories}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Receitas</CardTitle>
                  <CardDescription>
                    Categorias usadas para classificar entradas.
                  </CardDescription>
                </div>
                <CategoryDialog defaultType="income" />
              </CardHeader>
              <CardContent>
                <CategoryList categories={incomeCategories} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Despesas</CardTitle>
                  <CardDescription>
                    Categorias usadas para classificar saídas.
                  </CardDescription>
                </div>
                <CategoryDialog defaultType="expense" />
              </CardHeader>
              <CardContent>
                <CategoryList categories={expenseCategories} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
