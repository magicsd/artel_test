# @artelonline/ui

UI компоненты на основе shadcn/ui для проекта ArtelOnline.

## Установка компонентов

### Добавление отдельных компонентов

```bash
# Из корня проекта
cd packages/ui

# Добавить конкретный компонент
npm run add:button
npm run add:dialog
npm run add:form
npm run add:select

# Или использовать общую команду
npm run add-component <component-name>
```

### Массовое добавление компонентов

```bash
# Добавить основные компоненты
npm run setup-common

# Добавить все популярные компоненты
npm run setup-all
```

## Доступные компоненты

### Основные (setup-common)
- button
- card
- input
- label
- form
- dialog
- select
- textarea

### Дополнительные
- checkbox
- radio-group
- switch
- tabs
- table
- toast
- tooltip
- popover
- dropdown-menu
- navigation-menu
- sheet
- alert
- alert-dialog
- badge
- avatar
- skeleton
- progress
- slider
- separator
- accordion
- collapsible
- command
- combobox
- calendar
- date-picker

## Использование

```tsx
import { Button, Card, Dialog } from '@artelonline/ui'

export function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
      <Dialog>
        {/* Dialog content */}
      </Dialog>
    </Card>
  )
}
```

## Storybook

```bash
npm run storybook
```

Откроется на http://localhost:6006

## Тестирование

```bash
nx test @artelonline/ui
```

## Структура

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui компоненты
│   │   └── ...           # кастомные компоненты
│   ├── lib/
│   │   └── utils.ts      # утилиты
│   ├── globals.css       # глобальные стили Tailwind
│   └── index.ts          # экспорты
├── components.json       # конфигурация shadcn
└── package.json
```

## Примечания

- После добавления компонента через npm script, файл создается в корне проекта
- Необходимо вручную переместить файл в `packages/ui/src/components/ui/`
- Обновить экспорты в `packages/ui/src/index.ts`
- Это временное ограничение shadcn CLI в монорепозитории
