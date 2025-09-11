import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { defaultNS, resources } from './init.js';

export const useTranslation = (ns?: keyof typeof resources.en) => {
  return useTranslationOriginal(ns ?? defaultNS);
};

export const useLanguage = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    languages: ['en', 'ru'],
  };
};

