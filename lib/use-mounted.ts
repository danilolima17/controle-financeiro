"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` no servidor e no primeiro render, `true` depois da hidratação.
 * Serve para adiar UI que depende de APIs do navegador sem `setState` em efeito.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
