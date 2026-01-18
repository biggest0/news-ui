import common from "./en/common.json";

// Provide type safety for t() function and i18n resources
export interface Resources {
  common: typeof common;
}

export type Language = "en" | "fr";

export type TranslationNamespace = keyof Resources;