"use client";

import { useEffect } from 'react';

/**
 * Provider per la registrazione del Service Worker
 * Abilita le funzionalità PWA (installazione, cache offline)
 */
export function PWAProvider() {
  useEffect(() => {
    // Registra il service worker solo in ambiente browser e se supportato
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrato:', registration.scope);
          
          // Controlla aggiornamenti periodicamente
          setInterval(() => {
            registration.update();
          }, 60000); // Controlla ogni minuto
        })
        .catch((error) => {
          console.error('Errore nella registrazione del Service Worker:', error);
        });
    }
  }, []);

  return null; // Componente senza UI
}

