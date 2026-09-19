import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md",
        className
      )}
    >
      <Wallet className="size-[17px]" />
    </span>
  );
}
