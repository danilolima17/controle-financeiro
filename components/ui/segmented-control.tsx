"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

/**
 * Um único controle segmentado para todo o app: tipo da transação, filtro de
 * lista e seleção de tema. `tone="financial"` pinta a opção ativa com a cor
 * de receita ou despesa; o padrão é neutro.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  tone = "neutral",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: {
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  tone?: "neutral" | "financial";
  size?: "default" | "lg";
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "bg-surface-sunken border-border/70 grid gap-1 rounded-lg border p-1",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map((option) => {
        const active = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors duration-150",
              size === "lg" ? "h-10 text-sm" : "h-8 text-[0.8125rem]",
              active
                ? tone === "financial"
                  ? option.value === "income"
                    ? "bg-income text-white"
                    : "bg-expense text-white"
                  : "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {Icon && <Icon className="size-4" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
