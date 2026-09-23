// Service worker do Simulador KPI de Produção.
// Estratégia: cache-first para o "app shell" (arquivos principais),
// com atualização em segundo plano. Sem chamadas de rede externas.

const CACHE_NAME = 'simulador-kpi-v1';

// Decisão de implementação: a lista abaixo cobre os arquivos essenciais
// para o app abrir e funcionar offline. Ao publicar uma nova versão,
// troque o número em CACHE_NAME (ex.: v2) para forçar a atualização do
// cache em todos os aparelhos — ver README.md, seção "Como atualizar".
const APP_SHELL = [
  './index.html',
  './dashboard_kpi_producao.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Só trata requisições GET dentro do mesmo escopo do app.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const rede = fetch(event.request)
        .then((resposta) => {
          if (resposta && resposta.status === 200) {
            const copia = resposta.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          }
          return resposta;
        })
        .catch(() => cached); // offline: usa o cache se a rede falhar

      // cache-first: responde rápido com o cache e atualiza em segundo plano
      return cached || rede;
    })
  );
});
