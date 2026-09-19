"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      // Em desenvolvimento o service worker não deve existir: um registro
      // deixado por uma build de produção na mesma origem (localhost) fica
      // interceptando requisições e pode servir arquivos de uma versão
      // anterior. Removemos o registro e os caches dele.
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) registration.unregister();
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) caches.delete(key);
        });
      }
      return;
    }

    navigator.serviceWorker
      // `updateViaCache: "none"` força revalidar o próprio sw.js, senão o
      // navegador pode manter a versão antiga por até 24h.
      .register("/sw.js", { updateViaCache: "none" })
      .catch(() => {
        // Sem service worker o app segue funcionando normalmente.
      });
  }, []);

  return null;
}
