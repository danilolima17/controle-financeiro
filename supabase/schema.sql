-- Controle Financeiro — schema do Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- (https://supabase.com/dashboard/project/_/sql/new).

-- ========== categories ==========
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null default '#6366f1',
  created_at timestamptz not null default now(),
  unique (user_id, name, type)
);

alter table public.categories enable row level security;

create policy "Users can view their own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- ========== transactions ==========
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_occurred_on_idx
  on public.transactions (user_id, occurred_on desc);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- ========== categorias padrão para novos usuários ==========
create or replace function public.handle_new_user_default_categories()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.categories (user_id, name, type, color) values
    (new.id, 'Salário', 'income', '#22c55e'),
    (new.id, 'Outras receitas', 'income', '#84cc16'),
    (new.id, 'Alimentação', 'expense', '#f97316'),
    (new.id, 'Moradia', 'expense', '#0ea5e9'),
    (new.id, 'Transporte', 'expense', '#a855f7'),
    (new.id, 'Saúde', 'expense', '#ef4444'),
    (new.id, 'Lazer', 'expense', '#eab308'),
    (new.id, 'Outras despesas', 'expense', '#64748b');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_default_categories();
