import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Altura única de 44px: alvo de toque confortável, e sem variantes
        // `md:` — elas venceriam as classes que cada campo passa (o campo de
        // valor, por exemplo, define a própria altura).
        "border-input bg-card placeholder:text-faint-foreground flex h-11 w-full min-w-0 rounded-md border px-3.5 text-base transition-[border-color,box-shadow] duration-150 outline-none",
        "hover:border-border-strong",
        "focus-visible:border-ring focus-visible:ring-ring/25 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/25",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
