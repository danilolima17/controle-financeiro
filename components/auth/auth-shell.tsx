import { ChartPie, ShieldCheck, Target } from "lucide-react";

import { BrandMark } from "@/components/shell/brand-mark";

const HIGHLIGHTS = [
  {
    icon: ChartPie,
    title: "Tudo em uma tela",
    description: "Receitas, despesas e saldo do mês sem planilha.",
  },
  {
    icon: Target,
    title: "Limite por categoria",
    description: "Defina um teto de gastos e acompanhe quanto sobra.",
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
      {/* Painel de marca — cor sólida, sem efeitos: a identidade vem da
          tipografia e do espaço, não de um degradê. */}
      <div className="bg-primary text-primary-foreground hidden w-[46%] max-w-xl flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-white/15">
            <ChartPie className="size-[17px]" />
          </span>
          <span className="font-semibold tracking-tight">
            Controle Financeiro
          </span>
        </div>

        <div>
          <h1 className="max-w-md text-[2.5rem] leading-[1.1] font-semibold tracking-tight">
            Saiba para onde vai o seu dinheiro.
          </h1>

          <ul className="mt-12 flex flex-col gap-7">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <item.icon className="mt-0.5 size-[18px] shrink-0 opacity-80" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-sm opacity-70">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs opacity-60">
          Feito com Next.js, Supabase e shadcn/ui.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[22rem]">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <BrandMark />
            <span className="font-semibold tracking-tight">
              Controle Financeiro
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
