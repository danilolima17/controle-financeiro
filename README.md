# Controle Financeiro

App de controle financeiro pessoal construído com Next.js (App Router),
[Supabase](https://supabase.com) (autenticação e banco de dados com Row Level
Security) e [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS v4.

## Funcionalidades

- Cadastro/login por e-mail e senha (Supabase Auth), com confirmação por e-mail
- Sessão protegida em todas as rotas via `proxy.ts` (renomeado de
  `middleware.ts` no Next.js 16)
- Dashboard com totais de receitas, despesas e saldo
- CRUD de transações (receitas/despesas) com categoria, valor, descrição e data
- CRUD de categorias, com categorias padrão criadas automaticamente no
  cadastro do usuário

## Configuração

### 1. Criar um projeto no Supabase

Crie um projeto em [supabase.com](https://supabase.com/dashboard) e, no
**SQL Editor**, execute o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).
Isso cria as tabelas `categories` e `transactions`, as policies de Row Level
Security (cada usuário só acessa seus próprios dados) e um trigger que cria
categorias padrão para cada novo usuário.

### 2. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha com a URL e a chave
pública (`anon`) do seu projeto, encontradas em **Project Settings > API**:

```bash
cp .env.local.example .env.local
```

### 3. Rodar o projeto

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Você será redirecionado
para `/login` até criar uma conta.

## Stack

- [Next.js 16](https://nextjs.org/docs) (App Router, Server Actions, Proxy)
- [Supabase](https://supabase.com) (`@supabase/ssr`) para auth e Postgres
- [shadcn/ui](https://ui.shadcn.com) (Radix UI + `class-variance-authority`)
- [Tailwind CSS v4](https://tailwindcss.com)
