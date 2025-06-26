
const CACHE_NAME = 'linkbio-ai-v1.1.0';
const OFFLINE_CACHE = 'linkbio-ai-offline-v1';

// Recursos essenciais para cache
const urlsToCache = [
  '/',
  '/dashboard',
  '/login',
  '/signup',
  '/offline',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Recursos para cache offline
const offlineResources = [
  '/',
  '/offline'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v1.1.0');
  
  event.waitUntil(
    Promise.all([
      // Cache principal
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      }),
      // Cache offline
      caches.open(OFFLINE_CACHE).then((cache) => {
        console.log('[SW] Caching offline resources');
        return cache.addAll(offlineResources);
      })
    ]).catch((error) => {
      console.error('[SW] Failed to cache:', error);
    })
  );
  
  // Force activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v1.1.0');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Notificar clientes sobre update disponível
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            version: '1.1.0'
          });
        });
      })
    ])
  );
  
  self.clients.claim();
});

// Fetch event - estratégia de cache inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip Supabase e APIs externas
  if (request.url.includes('supabase') || 
      request.url.includes('stripe') || 
      request.url.includes('api')) {
    return event.respondWith(fetch(request));
  }

  // Estratégia para diferentes tipos de recursos
  if (request.destination === 'document') {
    // Para páginas HTML - Network First com fallback offline
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Para imagens - Cache First
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Para outros recursos - Stale While Revalidate
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Network First Strategy - ideal para páginas HTML
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Se não tem cache e está offline, mostrar página offline
    if (request.destination === 'document') {
      const offlineCache = await caches.open(OFFLINE_CACHE);
      return offlineCache.match('/offline') || new Response('Offline');
    }
    
    throw error;
  }
}

// Cache First Strategy - ideal para imagens e assets estáticos
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache and network failed for:', request.url);
    throw error;
  }
}

// Stale While Revalidate Strategy - ideal para recursos dinâmicos
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Sempre tentar buscar versão atualizada em background
  const networkResponsePromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Silenciosamente falha se não conseguir atualizar
    return null;
  });
  
  // Retorna cache imediatamente se disponível, senão espera network
  return cachedResponse || networkResponsePromise;
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização do LinkBio.AI disponível!',
    icon: '/icon-192.png',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir App',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/favicon.ico'
      }
    ],
    tag: 'linkbio-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('LinkBio.AI', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Se já tem uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Se não tem janela aberta, abrir nova
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    
    event.waitUntil(
      // Aqui pode implementar lógica para sincronizar dados offline
      Promise.resolve()
    );
  }
});

// Message event - comunicação com o app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.1.0' });
  }
});
