export type TransactionType = "income" | "expense";

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  color: string;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  occurred_on: string;
  created_at: string;
};

export type TransactionWithCategory = Transaction & {
  category: Pick<Category, "id" | "name" | "color"> | null;
};
