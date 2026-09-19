"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

/**
 * Folha que sobe pela base da tela. É o container de rolagem: o cabeçalho
 * gruda no topo e o rodapé na base (ver SheetFooter), então o puxador e o
 * botão principal nunca saem da tela, nem em aparelho baixo ou com o teclado
 * aberto. `overscroll-contain` impede a rolagem de vazar para a página atrás.
 */
function SheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        // Sem isto o Radix foca o primeiro elemento tabulável — o botão de
        // fechar — e a folha abre com um anel de foco em volta do X. O foco
        // vai para o contêiner, que continua dentro da folha.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement | null)?.focus();
        }}
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom max-h-sheet fixed inset-x-0 bottom-0 z-50 flex flex-col gap-4 overflow-y-auto overscroll-contain rounded-t-2xl border-t px-5 pt-2 pb-0 shadow-xl transition ease-in-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
          className
        )}
        {...props}
      >
        <div className="bg-background sticky top-0 z-20 -mx-5 -mt-2 px-5 pt-3 pb-2">
          {/* Puxador: o mesmo affordance das folhas nativas. */}
          <div
            aria-hidden
            className="bg-border mx-auto h-1.5 w-10 rounded-full"
          />
          {showCloseButton && (
            <SheetPrimitive.Close className="ring-offset-background focus:ring-ring absolute top-2.5 right-4 rounded-full p-1.5 opacity-60 transition-opacity hover:opacity-100 focus:ring-2 focus:outline-hidden">
              <XIcon className="size-4" />
              <span className="sr-only">Fechar</span>
            </SheetPrimitive.Close>
          )}
        </div>
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        // Gruda na base da folha: em tela curta (ou com o teclado aberto) o
        // conteúdo rola por baixo e o botão continua acessível.
        "bg-background sticky bottom-0 z-10 -mx-5 mt-1 flex flex-col gap-2 border-t px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground text-lg font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
};
