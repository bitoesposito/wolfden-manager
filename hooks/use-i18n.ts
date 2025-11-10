/**
 * Hook for i18n translations
 * Integrates with Next.js i18n routing
 * Reads locale from cookie, URL path, or falls back to default
 * 
 * Compatible with Next.js i18n routing approach:
 * - Reads locale from URL path (e.g., /en/page -> 'en')
 * - Falls back to cookie (NEXT_LOCALE) if no path prefix
 * - Uses default locale ('it') as final fallback
 */

import { usePathname } from 'next/navigation';
import { getTranslation, defaultLocale, type Locale } from '@/i18n';
import { useEffect, useState } from 'react';

const SUPPORTED_LOCALES = ['it', 'en'] as const;
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Extracts locale from cookie
 * @returns Locale from cookie or undefined if not found/invalid
 */
function getLocaleFromCookie(): Locale | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split('=')[1] as Locale | undefined;

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  return undefined;
}

/**
 * Extracts locale from URL pathname
 * @param pathname - Current pathname
 * @returns Locale from path or undefined if not found/invalid
 */
function getLocaleFromPath(pathname: string): Locale | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as typeof SUPPORTED_LOCALES[number])) {
    return firstSegment as Locale;
  }
  
  return undefined;
}

/**
 * Hook to get translations
 * Automatically detects locale from URL path, cookie, or uses default
 */
export function useI18n() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Strategy 1: Extract locale from pathname (e.g., /en/page -> 'en')
    const pathLocale = getLocaleFromPath(pathname);
    if (pathLocale) {
      setLocale(pathLocale);
      return;
    }

    // Strategy 2: Read from cookie (set by middleware)
    const cookieLocale = getLocaleFromCookie();
    if (cookieLocale) {
      setLocale(cookieLocale);
      return;
    }

    // Strategy 3: Fallback to default
    setLocale(defaultLocale);
  }, [pathname]);

  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(locale, key, params);
  };

  return { t, locale };
}

