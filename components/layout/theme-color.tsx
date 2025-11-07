"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Componente per aggiornare dinamicamente il theme-color meta tag
 * in base al tema corrente (light/dark)
 * Questo permette alla PWA di avere il colore della finestra
 * che corrisponde allo sfondo dell'applicazione
 */
export function ThemeColor() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Usa resolvedTheme per ottenere il tema effettivo (considera anche 'system')
    const currentTheme = resolvedTheme || theme;
    
    // Colori corrispondenti agli sfondi dell'app
    // Light: oklch(1 0 0) = #ffffff
    // Dark: oklch(0.145 0 0) = #252525
    const themeColor = currentTheme === 'dark' ? '#252525' : '#ffffff';
    
    // Trova o crea il meta tag theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.setAttribute('content', themeColor);
  }, [theme, resolvedTheme]);

  return null; // Componente senza UI
}

