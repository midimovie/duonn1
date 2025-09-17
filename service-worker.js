const CACHE_NAME = 'duonn-suporte-cache-v7'; // Version bumped for update
const urlsToCache = [
  '/', // Caches the root, which is usually index.html
  'index.html',
  'index.css',
  'index.tsx',
  'manifest.json',
  // App assets
  'https://yt3.googleusercontent.com/BF0uGWCP5u6HLQEfgqXP-Nmt40uU45bm6FlfWLl8iS3x6ue3CisXve2XScLbPPngYnm9YGkSzA=s900-c-k-c0x00ffffff-no-rj',
  'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  // Critical JS dependencies from esm.sh (based on index.html importmap)
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react-dom@^19.1.1/client',
  // Critical CSS/Font dependencies
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

// Evento de instalação: abre um cache e adiciona os arquivos principais a ele.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened. Caching core assets.');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All core assets were successfully cached.');
        // Não força mais a ativação imediata. O novo SW aguardará a interação do usuário.
      })
      .catch(error => {
        console.error('Core asset caching failed:', error);
      })
  );
});

// Evento de ativação: limpa caches antigos para manter tudo atualizado.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Diz ao service worker ativo para assumir o controle da página imediatamente.
      return self.clients.claim();
    })
  );
});

// Estratégia: Cache-First, Then Network (Cache primeiro, depois Rede)
self.addEventListener('fetch', event => {
  // Apenas lida com requisições GET e com protocolo http/https.
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Se o recurso estiver no cache, retorne-o.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se não estiver no cache, busque na rede.
        return fetch(event.request).then(networkResponse => {
          
          // Apenas queremos armazenar em cache respostas bem-sucedidas.
          // Respostas "opacas" (de requisições de origem cruzada sem CORS) têm status 0,
          // mas vamos armazená-las para permitir que CDNs e outros recursos de terceiros funcionem offline.
          if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) {
            return networkResponse;
          }

          // IMPORTANTE: Clone a resposta. Uma resposta é um stream e
          // como queremos que o navegador e o cache consumam a resposta,
          // precisamos cloná-la para ter dois streams.
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        });
      })
      .catch(error => {
        console.error('Falha no fetch do Service Worker:', error);
        // Em um aplicativo real, você poderia retornar uma página offline personalizada aqui.
      })
  );
});

// Ouve mensagens da aplicação (cliente).
self.addEventListener('message', (event) => {
  // Se a mensagem for para pular a espera, o SW se tornará ativo.
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
