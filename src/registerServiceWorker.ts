// src/registerServiceWorker.ts
// Progressive Web App Service Worker Registration

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[LumaBooth PWA] Service Worker registered with scope:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[LumaBooth PWA] New version available. Refresh to update.');
              } else {
                console.log('[LumaBooth PWA] Content is cached for offline use.');
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('[LumaBooth PWA] Service Worker registration failed:', error);
      });
  });
}
