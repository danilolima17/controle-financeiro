// Service worker do Controle Financeiro.
//
// Escopo deliberadamente pequeno: tela offline para navegações e mais nada.
// A versão anterior guardava /_next/static/ com estratégia cache-first e sem
// validade, então uma build nova era servida com o CSS e o JS da anterior —
// a página montava com classes que a folha de estilo em cache não tinha.
// Arquivos do Next já vêm com hash no nome e cabeçalho imutável; o cache do
// próprio navegador dá conta deles melhor do que nós.

const VERSION = "v2";
const SHELL_CACHE = `shell-${VERSION}`;
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== SHELL_CACHE).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (request.mode !== "navigate") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Sempre a rede primeiro; a tela offline é só o último recurso.
  event.respondWith(
    fetch(request).catch(async () => {
      const cache = await caches.open(SHELL_CACHE);
      return (
        (await cache.match(OFFLINE_URL)) ??
        new Response("Você está offline.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      );
    })
  );
});
