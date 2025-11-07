/**
 * Proxy for i18n routing (replaces deprecated middleware)
 * Handles locale detection and cookie management
 * 
 * Note: For App Router, Next.js doesn't support built-in i18n routing like Pages Router.
 * This proxy handles locale detection and sets it in a cookie for use in components.
 */

import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['it', 'en'] as const;
const DEFAULT_LOCALE = 'it';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip proxy for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Get locale from cookie, URL, or Accept-Language header
  let locale = request.cookies.get('NEXT_LOCALE')?.value as typeof LOCALES[number] | undefined;
  
  // Check if pathname has a locale prefix (e.g., /en/...)
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameSegments[0];
  
  if (firstSegment && LOCALES.includes(firstSegment as typeof LOCALES[number])) {
    locale = firstSegment as typeof LOCALES[number];
  }
  
  // If no locale found, detect from Accept-Language header
  if (!locale) {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferredLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
      if (LOCALES.includes(preferredLang as typeof LOCALES[number])) {
        locale = preferredLang as typeof LOCALES[number];
      }
    }
  }
  
  // Fallback to default locale
  locale = locale || DEFAULT_LOCALE;

  // Create response
  const response = NextResponse.next();
  
  // Set locale in cookie for persistence
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
  
  // Set locale in header for use in components
  response.headers.set('x-locale', locale);
  
  return response;
}

