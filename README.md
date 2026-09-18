# Controle Financeiro

App de controle financeiro pessoal — instalável no celular (PWA) — construído
com Next.js (App Router), [Supabase](https://supabase.com) (autenticação e
Postgres com Row Level Security) e [shadcn/ui](https://ui.shadcn.com) +
Tailwind CSS v4.

## Funcionalidades

- **Autenticação** por e-mail e senha, com confirmação por e-mail; todas as
  rotas protegidas por `proxy.ts` (o antigo `middleware.ts` do Next.js 16)
- **Dashboard** com saldo do mês em destaque, receitas, despesas, navegação
  entre meses e gráfico de evolução dos últimos 6 meses
- **Gastos por categoria** com barras proporcionais e percentuais
- **Orçamento mensal por categoria**, com barra de progresso e alerta de
  estouro
- **Transações**: criar, editar e excluir, com busca por descrição e filtros
  por tipo, categoria e mês
- **Categorias** personalizáveis (nome, ícone, cor e limite mensal); as
  categorias padrão são criadas no primeiro acesso
- **Tema claro/escuro** e instalação na tela de início como app

### Acessibilidade das cores

As cores dos gráficos foram validadas para daltonismo (separação ΔE ≥ 8 em
deuteranopia/protanopia/tritanopia), piso de visão normal e contraste mínimo
contra as superfícies claras e escuras do app. Receitas e despesas usam
teal/rosa em vez do par verde/vermelho, que falha na separação sob daltonismo,
e toda identidade por cor vem acompanhada de rótulo ou ícone.

## Configuração

### 1. Criar um projeto no Supabase

Crie um projeto em [supabase.com](https://supabase.com/dashboard) e, no
**SQL Editor**, execute o conteúdo de
[`supabase/schema.sql`](./supabase/schema.sql). O script cria as tabelas
`categories` e `transactions` com as policies de Row Level Security (cada
usuário só acessa os próprios dados) e pode ser executado novamente sem erro.

> Se você usou uma versão anterior deste schema e o cadastro falha com
> "Database error saving new user", rode o arquivo novamente: ele remove o
> trigger em `auth.users` que causava o erro. As categorias padrão passaram a
> ser criadas pelo app no primeiro acesso.

### 2. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha com a URL e a chave pública (`anon`) do projeto, em
**Project Settings > API**.

### 3. Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## PWA

O app tem manifesto, ícones e service worker próprios. Em produção
(`npm run build && npm start`), o navegador oferece instalar o app; no iPhone,
use Compartilhar → "Adicionar à Tela de Início". O service worker guarda apenas
arquivos estáticos e a tela offline — páginas autenticadas nunca vão para o
cache.

## Stack

- [Next.js 16](https://nextjs.org/docs) — App Router, Server Actions, Proxy
- [Supabase](https://supabase.com) (`@supabase/ssr`) — auth e Postgres
- [shadcn/ui](https://ui.shadcn.com) — Radix UI + `class-variance-authority`
- [Tailwind CSS v4](https://tailwindcss.com) e [Recharts](https://recharts.org)
