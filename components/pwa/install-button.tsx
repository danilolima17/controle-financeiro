"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Check, Download, Share } from "lucide-react";

import { useMounted } from "@/lib/use-mounted";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const standaloneQuery = "(display-mode: standalone)";

function subscribeToDisplayMode(onChange: () => void) {
  const media = window.matchMedia(standaloneQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function InstallButton() {
  const mounted = useMounted();
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);

  const isStandalone = useSyncExternalStore(
    subscribeToDisplayMode,
    () => window.matchMedia(standaloneQuery).matches,
    () => false
  );

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => setPrompt(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (isStandalone) {
    return (
      <p className="text-muted-foreground flex items-center gap-2 text-sm">
        <Check className="text-income size-4" />
        App instalado neste dispositivo.
      </p>
    );
  }

  // O Safari não dispara beforeinstallprompt: no iOS a instalação é manual.
  const isIos =
    mounted && /iphone|ipad|ipod/i.test(navigator.userAgent) && !prompt;

  if (isIos) {
    return (
      <p className="text-muted-foreground flex items-start gap-2 text-sm">
        <Share className="mt-0.5 size-4 shrink-0" />
        No iPhone, toque em Compartilhar e escolha &ldquo;Adicionar à Tela de
        Início&rdquo;.
      </p>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={!prompt}
      onClick={async () => {
        if (!prompt) return;
        await prompt.prompt();
        await prompt.userChoice;
        setPrompt(null);
      }}
    >
      <Download />
      {prompt ? "Instalar aplicativo" : "Indisponível neste navegador"}
    </Button>
  );
}
