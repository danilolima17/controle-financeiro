"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { useMounted } from "@/lib/use-mounted";
import { SegmentedControl } from "@/components/ui/segmented-control";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <SegmentedControl
      size="lg"
      aria-label="Tema do aplicativo"
      options={OPTIONS}
      // Antes de hidratar não sabemos o tema; "system" é o padrão do provider.
      value={mounted ? ((theme ?? "system") as "light" | "dark" | "system") : "system"}
      onValueChange={setTheme}
    />
  );
}
