// Service Worker per WolfDen Manager PWA
// Gestisce la cache offline e migliora le performance

const CACHE_NAME = 'wolfden-manager-v1';
const RUNTIME_CACHE = 'wolfden-runtime-v1';

// Risorse da cachare immediatamente all'installazione
// Queste risorse sono essenziali per il funzionamento offline
const PRECACHE_ASSETS = [
  '/',
  '/favicon.ico',
  '/alarm.mp3', // File audio per i timer
  '/site.webmanifest', // Manifest PWA
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
];

// Installazione del service worker - precache delle risorse essenziali
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()) // Attiva immediatamente il nuovo SW
  );
});

// Attivazione del service worker - pulizia delle cache vecchie
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // Prende controllo di tutte le pagine
  );
});

// Strategia di caching migliorata per supporto offline completo
// Network First con fallback alla cache per tutte le risorse
self.addEventListener('fetch', (event) => {
  // Ignora richieste non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Ignora richieste a servizi esterni (come Google Fonts)
  // Questi non possono essere cachati dal service worker
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) => {
      // Strategia Network First: prova prima la rete, poi la cache
      return fetch(event.request)
        .then((response) => {
          // Salva in cache solo risposte valide
          // Cache anche risposte con status diverso da 200 se sono navigazioni
          if (response.status === 200 || (response.status === 0 && event.request.mode === 'navigate')) {
            // Clona la risposta per salvarla in cache
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => {
          // Rete non disponibile: cerca nella cache
          return cache.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Fallback speciale per navigazioni: restituisci la pagina principale
            if (event.request.mode === 'navigate') {
              return cache.match('/').then((indexPage) => {
                if (indexPage) {
                  return indexPage;
                }
                // Se anche la pagina principale non è in cache, restituisci una risposta offline
                return new Response('App non in cache - Ricarica quando hai connessione', {
                  status: 503,
                  headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
              });
            }
            
            // Per altre risorse, restituisci errore 503
            return new Response('Risorsa non in cache', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
        });
    })
  );
});

