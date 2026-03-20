import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

const deviceLang = getLocales()?.[0]?.languageCode === 'fr' ? 'fr' : 'en';

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: deviceLang,
  fallbackLng: 'en',
  interpolation: {
    // React already escapes values
    escapeValue: false,
  },
});

export default i18next;
