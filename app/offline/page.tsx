import type { Metadata } from "next";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Sem conexão — Controle Financeiro",
};

export default function OfflinePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="bg-accent text-primary flex size-16 items-center justify-center rounded-2xl">
        <WifiOff className="size-7" />
      </span>
      <div>
        <h1 className="text-xl font-semibold">Você está sem conexão</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Assim que a internet voltar, seus dados aparecem novamente.
        </p>
      </div>
    </div>
  );
}
