"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Mesmo ponto de corte do `md:` do Tailwind. */
const MOBILE_QUERY = "(max-width: 767px)";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // No servidor assumimos desktop; o cliente corrige na hidratação, e como
    // o conteúdo do modal só existe quando aberto, nada pisca na tela.
    () => false
  );
}

export function useIsMobile() {
  return useMediaQuery(MOBILE_QUERY);
}
