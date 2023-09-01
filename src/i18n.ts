import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  da: {
    translation: require('./locales/da.json')
  },
  de: {
    translation: require('./locales/de.json')
  },
  en: {
    translation: require('./locales/en.json')
  },
  es: {
    translation: require('./locales/es.json')
  },
  fr: {
    translation: require('./locales/fr.json')
  },
};
const defaultLanguage = 'en';
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: window.navigator.language, // default language
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;