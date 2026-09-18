-- Controle Financeiro — schema do Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- (https://supabase.com/dashboard/project/_/sql/new).
-- O script é idempotente: pode ser executado novamente sem erros.

-- ========== categories ==========
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null default '#2a78d6',
  icon text not null default 'tag',
  monthly_budget numeric(12, 2),
  created_at timestamptz not null default now(),
  unique (user_id, name, type)
);

-- Colunas adicionadas depois da primeira versão do schema.
alter table public.categories
  add column if not exists icon text not null default 'tag';
alter table public.categories
  add column if not exists monthly_budget numeric(12, 2);

alter table public.categories enable row level security;

drop policy if exists "Users can view their own categories" on public.categories;
create policy "Users can view their own categories"
  on public.categories for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own categories" on public.categories;
create policy "Users can insert their own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own categories" on public.categories;
create policy "Users can update their own categories"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own categories" on public.categories;
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

drop policy if exists "Users can view their own transactions" on public.transactions;
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own transactions" on public.transactions;
create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own transactions" on public.transactions;
create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own transactions" on public.transactions;
create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- ========== limpeza de versões anteriores ==========
-- A primeira versão deste schema criava categorias padrão por um trigger em
-- auth.users. Qualquer falha ali derruba o cadastro inteiro com
-- "Database error saving new user", então o app passou a criar as categorias
-- padrão no primeiro acesso. Removemos o trigger caso ele exista.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user_default_categories();
