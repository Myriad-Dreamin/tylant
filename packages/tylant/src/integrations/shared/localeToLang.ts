import type { TylantConfig } from '../../types';
import { BuiltInDefaultLocale } from '../../i18n';

/**
 * Get the BCP-47 language tag for the given locale.
 * @param locale Locale string or `undefined` for the root locale.
 */
export function localeToLang(
    config: Pick<TylantConfig, 'defaultLocale' | 'locales'>,
    locale: string | undefined
): string {
    const lang = locale ? config.locales?.[locale]?.lang : config.locales?.root?.lang;
    const defaultLang = config.defaultLocale?.lang || config.defaultLocale?.locale;
    return lang || defaultLang || BuiltInDefaultLocale.lang;
}