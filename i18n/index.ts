/**
 * i18n - Internationalization
 * Centralized translation files for the application
 * 
 * Usage:
 * import translations from '@/i18n/it.json';
 * const text = translations.card.delete;
 * 
 * Or with a helper function:
 * import { getTranslation } from '@/i18n';
 * const text = getTranslation('card.delete', { name: 'Station 1' });
 */

import itTranslations from './it.json';
import enTranslations from './en.json';

export type TranslationKey = 
  | 'common'
  | 'header'
  | 'home'
  | 'section'
  | 'card'
  | 'contextMenu'
  | 'addTimeDialog'
  | 'timerDetails';

export type Locale = 'it' | 'en';

export const translations = {
  it: itTranslations,
  en: enTranslations,
} as const;

/**
 * Get translation for a specific key
 * Supports nested keys with dot notation (e.g., 'card.delete')
 * Supports placeholders with {key} syntax
 * 
 * @param locale - The locale to use ('it' | 'en')
 * @param key - The translation key (supports dot notation for nested keys)
 * @param params - Optional parameters to replace placeholders
 * @returns The translated string
 * 
 * @example
 * getTranslation('it', 'card.deleteConfirm', { name: 'Station 1' })
 * // Returns: "Sei sicuro di voler eliminare la postazione \"Station 1\"? Questa azione non può essere annullata."
 */
export function getTranslation(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value];
    } else {
      console.warn(`Translation key not found: ${key} for locale: ${locale}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key} for locale: ${locale}`);
    return key;
  }

  // Replace placeholders
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() ?? match;
    });
  }

  return value;
}

/**
 * Get all translations for a specific locale
 * @param locale - The locale to use ('it' | 'en')
 * @returns All translations for the locale
 */
export function getTranslations(locale: Locale) {
  return translations[locale];
}

/**
 * Default locale (can be changed based on user preference or browser settings)
 */
export const defaultLocale: Locale = 'it';

