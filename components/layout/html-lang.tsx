/**
 * Client component to set dynamic lang attribute on html element
 * Reads locale from cookie or URL and updates html lang attribute
 */

'use client';

import { useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';

/**
 * Component that updates html lang attribute based on current locale
 * This ensures SEO and accessibility compliance
 */
export function HtmlLang() {
  const { locale } = useI18n();

  useEffect(() => {
    // Update html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}

