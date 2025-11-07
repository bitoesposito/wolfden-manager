import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: i18n config in next.config.ts is primarily for Pages Router.
  // For App Router, we handle routing via middleware and components.
  // This config is kept for compatibility and future Pages Router support.
  i18n: {
    // Supported locales
    locales: ['it', 'en'],
    // Default locale (no prefix in URL)
    defaultLocale: 'it',
    // Enable automatic locale detection based on Accept-Language header
    localeDetection: true,
  },
};

export default nextConfig;
