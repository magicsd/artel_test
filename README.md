# ArtelOnline Frontend Monorepo

Современный Nx монорепозиторий для фронтенд приложений ArtelOnline.

## Структура проекта

```
├── apps/
│   ├── platform/      # SPA платформа
│   ├── telegram/      # Telegram Mini App
│   └── marketing/     # Маркетинговый сайт
├── packages/
│   ├── ui/            # UI компоненты (shadcn/ui)
│   ├── shared/        # Общие утилиты и типы
│   └── config/        # Конфигурации
└── scripts/           # Автоматизация
```

## Быстрый старт

```bash
# Установка зависимостей
pnpm install

# Запуск приложений
pnpm nx serve platform    # http://localhost:4200
pnpm nx serve telegram    # http://localhost:4201
pnpm nx serve marketing   # http://localhost:4202

# Storybook для UI компонентов
cd packages/ui && npm run storybook  # http://localhost:6006
```

## Добавление UI компонентов

### Простая команда

```bash
# Добавить любой shadcn компонент одной командой
pnpm add:ui dialog
pnpm add:ui button
pnpm add:ui form
pnpm add:ui select
```

### Доступные компоненты

- **Основные**: button, card, input, label, form, dialog, select, textarea
- **Формы**: checkbox, radio-group, switch
- **Навигация**: tabs, navigation-menu, dropdown-menu
- **Отображение**: table, toast, tooltip, popover, sheet, alert, alert-dialog
- **Визуальные**: badge, avatar, skeleton, progress, slider, separator
- **Интерактивные**: accordion, collapsible, command, combobox
- **Даты**: calendar, date-picker

### Что происходит автоматически

1. ✅ Компонент добавляется через shadcn CLI
2. ✅ Файлы перемещаются в `packages/ui/src/components/ui/`
3. ✅ Экспорты обновляются в `packages/ui/src/index.ts`
4. ✅ Зависимости устанавливаются автоматически

## Технологии

- **Фреймворк**: React 19 + TypeScript
- **Сборка**: Vite + Nx
- **Стили**: Tailwind CSS 4
- **UI**: shadcn/ui компоненты
- **Роутинг**: React Router v7
- **Формы**: React Hook Form + Zod
- **Состояние**: Zustand + React Context
- **i18n**: i18next + react-i18next
- **Тестирование**: Vitest + Testing Library
- **Документация**: Storybook
- **Качество кода**: ESLint + Prettier + Husky

## Разработка

### Команды

```bash
# Сборка всех проектов
pnpm nx build-all

# Тестирование
pnpm nx test ui
pnpm nx test platform

# Линтинг
pnpm nx lint platform
pnpm nx lint ui

# Форматирование
pnpm prettier --write .
```

### Добавление нового приложения

```bash
pnpm nx g @nx/react:app my-app
```

### Добавление новой библиотеки

```bash
pnpm nx g @nx/react:library my-lib --directory=packages/my-lib
```

## Интернационализация

Поддерживаются языки: русский (по умолчанию), английский

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation('common')
  return <h1>{t('welcome')}</h1>
}
```

## Деплой

```bash
# Сборка для продакшена
pnpm nx build platform

# Статические файлы будут в dist/apps/platform
```

## Архитектура

- **Монорепозиторий**: Nx для управления зависимостями
- **Модульность**: Изолированные пакеты с четкими границами
- **Переиспользование**: Общие компоненты и утилиты
- **Типизация**: Строгий TypeScript во всех пакетах
- **Современность**: Последние версии всех технологий

## Лицензия

MIT
