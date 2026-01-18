import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./en/common.json";
import frCommon from "./fr/common.json";

// Define the resources for each language and namespace
const resources = {
  en: {
    common: enCommon,
  },
  fr: {
    common: frCommon,
  },
} as const;

// Initialize i18next with react-i18next and language detection
// Singleton imported in main.tsx
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "fr"],
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;