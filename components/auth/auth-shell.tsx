import { ChartPie, ShieldCheck, Wallet } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: ChartPie,
    title: "Tudo em um lugar",
    description: "Receitas, despesas e saldo do mês em uma tela só.",
  },
  {
    icon: Wallet,
    title: "Orçamento por categoria",
    description: "Defina limites e acompanhe quanto ainda pode gastar.",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados, só seus",
    description: "Cada conta enxerga apenas os próprios lançamentos.",
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      {/* Painel de marca (desktop) */}
      <div className="bg-brand-gradient relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Wallet className="size-5" />
          </span>
          <span className="text-lg font-semibold">Controle Financeiro</span>
        </div>

        <div className="relative">
          <h1 className="max-w-md text-4xl font-semibold tracking-tight">
            Saiba exatamente para onde vai o seu dinheiro.
          </h1>
          <ul className="mt-10 flex flex-col gap-6">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <item.icon className="size-[18px]" />
                </span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-white/75">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">
          Feito com Next.js, Supabase e shadcn/ui.
        </p>
      </div>

      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="bg-brand-gradient shadow-primary/25 flex size-10 items-center justify-center rounded-xl text-white shadow-lg">
              <Wallet className="size-5" />
            </span>
            <span className="text-lg font-semibold">
              Controle
              <span className="text-brand-gradient"> Financeiro</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
