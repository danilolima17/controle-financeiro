import { House, Settings, Shapes, ArrowRightLeft } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: House },
  { href: "/transacoes", label: "Transações", icon: ArrowRightLeft },
  { href: "/categorias", label: "Categorias", icon: Shapes },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
] as const;
