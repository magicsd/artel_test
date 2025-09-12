import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const defaultNS = 'common'

// Fallback resources in case files don't load
export const resources = {
  en: {
    common: {
      welcome: 'Welcome to Platform',
      loading: 'Loading...',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      toggleLanguage: 'Toggle language',
      toggleTheme: 'Toggle theme',
      userMenu: 'User menu',
      menu: 'Menu',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Sign Out',
      navigation: {
        platform: 'Platform',
        dashboard: 'Dashboard',
        dashboardDesc: 'Access your personal dashboard',
        about: 'About',
        aboutDesc: 'Learn more about our platform',
        home: 'Home',
        login: 'Sign In',
        register: 'Sign Up',
      },
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      allRightsReserved: 'All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
      support: 'Support',
      hero: {
        title: 'Welcome to ArtelOnline Platform',
        subtitle: 'The modern platform for collaboration and productivity',
      },
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      features: {
        title: 'Everything you need',
        subtitle: 'Powerful features to help you work better',
        collaboration: 'Collaboration',
        collaborationDesc: 'Work together with your team in real-time',
        performance: 'Performance',
        performanceDesc: 'Fast and reliable platform for your needs',
        security: 'Security',
        securityDesc: 'Your data is safe and secure with us',
        global: 'Global',
        globalDesc: 'Access from anywhere in the world',
      },
      cta: {
        title: 'Ready to get started?',
        subtitle: 'Join thousands of users who trust our platform',
      },
      signUpNow: 'Sign Up Now',
      signIn: 'Sign In',
    },
    auth: {
      login: {
        title: 'Good to see you again',
        subtitle: 'Sign in with your Telegram account',
        telegramButton: 'Sign in with Telegram',
        or: 'or',
        loginLabel: 'Login / Email / Phone',
        passwordLabel: 'Password',
        forgotPassword: 'Forgot password?',
        loginButton: 'Sign In',
        noAccount: "Don't have an account?",
        createAccount: 'Create',
        agreement: 'By using ArtelOnline service, you agree to the terms of the',
        offerAgreement: 'offer agreement',
      },
    },
  },
  ru: {
    common: {
      welcome: 'Добро пожаловать в Платформу',
      loading: 'Загрузка...',
      error: 'Ошибка',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      create: 'Создать',
      update: 'Обновить',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировка',
      next: 'Далее',
      previous: 'Назад',
      close: 'Закрыть',
      open: 'Открыть',
      yes: 'Да',
      no: 'Нет',
      toggleLanguage: 'Переключить язык',
      toggleTheme: 'Переключить тему',
      userMenu: 'Меню пользователя',
      menu: 'Меню',
      profile: 'Профиль',
      settings: 'Настройки',
      logout: 'Выйти',
      navigation: {
        platform: 'Платформа',
        dashboard: 'Дашборд',
        dashboardDesc: 'Доступ к вашему личному дашборду',
        about: 'О нас',
        aboutDesc: 'Узнайте больше о нашей платформе',
        home: 'Главная',
        login: 'Войти',
        register: 'Регистрация',
      },
      theme: {
        light: 'Светлая',
        dark: 'Тёмная',
        system: 'Системная',
      },
      allRightsReserved: 'Все права защищены.',
      privacy: 'Конфиденциальность',
      terms: 'Условия',
      support: 'Поддержка',
      hero: {
        title: 'Добро пожаловать на платформу АртельОнлайн',
        subtitle: 'Современная платформа для совместной работы и продуктивности',
      },
      getStarted: 'Начать',
      learnMore: 'Узнать больше',
      features: {
        title: 'Всё что вам нужно',
        subtitle: 'Мощные функции для лучшей работы',
        collaboration: 'Совместная работа',
        collaborationDesc: 'Работайте вместе с командой в реальном времени',
        performance: 'Производительность',
        performanceDesc: 'Быстрая и надежная платформа для ваших нужд',
        security: 'Безопасность',
        securityDesc: 'Ваши данные в безопасности',
        global: 'Глобальность',
        globalDesc: 'Доступ из любой точки мира',
      },
      cta: {
        title: 'Готовы начать?',
        subtitle: 'Присоединяйтесь к тысячам пользователей, которые доверяют нашей платформе',
      },
      signUpNow: 'Зарегистрироваться',
      signIn: 'Войти',
    },
    auth: {
      login: {
        title: 'Рады видеть вас снова',
        subtitle: 'Войдите через ваш аккаунт Telegram',
        telegramButton: 'Войти через Telegram',
        or: 'или',
        loginLabel: 'Логин / Email / Телефон',
        passwordLabel: 'Пароль',
        forgotPassword: 'Забыли пароль?',
        loginButton: 'Войти',
        noAccount: 'Нет аккаунта?',
        createAccount: 'Создать',
        agreement: 'Используя сервис АртельОнлайн, вы соглашаетесь с условиями',
        offerAgreement: 'договора оферты',
      },
    },
  },
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'en',
    defaultNS,
    ns: ['common', 'auth', 'dashboard'],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // resources, // Add fallback resources

    react: {
      useSuspense: false,
    },

    debug: true, // Enable debug to see what's happening
  })

export default i18n
