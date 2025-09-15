import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import enCommon from '../../../public/locales/en/common.json'
import ruCommon from '../../../public/locales/ru/common.json'
import enAuth from '../../../public/locales/en/auth.json'
import ruAuth from '../../../public/locales/ru/auth.json'
import enDashboard from '../../../public/locales/en/dashboard.json'
import ruDashboard from '../../../public/locales/ru/dashboard.json'

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
  },
  ru: {
    common: ruCommon,
    auth: ruAuth,
    dashboard: ruDashboard,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // default language
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
    
    debug: process.env.NODE_ENV === 'development',
  })

export default i18n

