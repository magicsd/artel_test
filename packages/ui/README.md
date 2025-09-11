# @artelonline/ui

UI компоненты на основе shadcn/ui для проекта ArtelOnline.

## Добавление компонентов

### Официальный shadcn CLI

```bash
# Из директории packages/ui
pnpm add dialog
pnpm add button
pnpm add form

# Или напрямую
pnpm dlx shadcn@latest add dialog
```

## Доступные компоненты

### Основные
- button, card, input, label, form, dialog, select, textarea

### Дополнительные
- checkbox, radio-group, switch, tabs, table, toast, tooltip
- popover, dropdown-menu, navigation-menu, sheet, alert, alert-dialog
- badge, avatar, skeleton, progress, slider, separator
- accordion, collapsible, command, combobox, calendar, date-picker

## После добавления компонента

1. ✅ Файлы создаются в `src/components/ui/`
2. 📝 Добавьте экспорт в `src/index.ts`:
   ```ts
   export * from './components/ui/new-component';
   ```
3. 🧪 При необходимости создайте Storybook stories
4. 🔧 Добавьте тесты для компонента

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
pnpm storybook
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
