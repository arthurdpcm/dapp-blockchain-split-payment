import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './constants/locales/en.json';
import pt from './constants/locales/pt.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en, // Use o objeto importado diretamente
    },
    pt: {
      translation: pt, 
    },
  },
  lng: 'pt', // idioma padrão
  fallbackLng: 'en', // idioma de fallback
  interpolation: {
    escapeValue: false, // React já faz o escape
  },
});

export default i18n;