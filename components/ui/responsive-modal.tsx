"use client";

import { useIsMobile } from "@/lib/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Os dois conjuntos são declarados fora do hook para manter a identidade dos
// componentes estável entre renders — do contrário o formulário remontaria
// (e perderia o que foi digitado) a cada atualização.
const MOBILE = {
  Root: Sheet,
  Trigger: SheetTrigger,
  Content: SheetContent,
  Header: SheetHeader,
  Title: SheetTitle,
  Description: SheetDescription,
  Footer: SheetFooter,
} as const;

const DESKTOP = {
  Root: Dialog,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
} as const;

/**
 * Folha deslizante no celular, janela centralizada no desktop.
 * As duas variantes têm a mesma estrutura, então o conteúdo não muda.
 */
export function useResponsiveModal() {
  return useIsMobile() ? MOBILE : DESKTOP;
}
