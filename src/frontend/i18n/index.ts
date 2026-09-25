import enTranslations from "./en.json";
import fiTranslations from "./fi.json";
import idTranslations from "./id.json";

const SUPPORTED_LANGUAGES = new Set<string>(["en", "fi", "id"]);
const DEFAULT_LANGUAGE = "en";

export const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  fi: fiTranslations,
  id: idTranslations,
};

export const getBrowserLanguage = (): string => {
  const browserLanguageCode = navigator.language.split(/[-_]/)[0];

  return SUPPORTED_LANGUAGES.has(browserLanguageCode)
    ? browserLanguageCode
    : DEFAULT_LANGUAGE;
};
