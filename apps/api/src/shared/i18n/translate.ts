import { I18nContext } from 'nestjs-i18n';

// Helper for common translation keys with safe fallback.
export const translate = (
  key: string,
  fallback: string,
  params?: Record<string, string | number>
): string => {
  const i18n = I18nContext.current();
  if (!i18n) {
    return fallback;
  }

  return i18n.t(key, { args: params, defaultValue: fallback });
};
