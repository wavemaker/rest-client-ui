import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: require('./locales/en.json')
  },
  vi: {
    translation: require('./locales/vi.json')
  },
  zh: {
    translation: require('./locales/zh.json')
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // default language
    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;