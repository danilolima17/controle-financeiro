import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-12 text-center",
        className
      )}
    >
      <span className="bg-surface-sunken text-faint-foreground flex size-11 items-center justify-center rounded-full">
        <Icon className="size-[18px]" />
      </span>
      <p className="mt-4 text-sm font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground mt-1 max-w-[34ch] text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
