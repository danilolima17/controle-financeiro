"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div className="bg-secondary grid grid-cols-3 gap-1 rounded-xl p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={mounted && theme === option.value}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-xs font-medium transition-all",
            mounted && theme === option.value
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <option.icon className="size-4" />
          {option.label}
        </button>
      ))}
    </div>
  );
}
