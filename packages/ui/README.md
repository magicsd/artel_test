# @artelonline/ui

UI компоненты на основе shadcn/ui для проекта ArtelOnline.

## Добавление компонентов

### Официальный shadcn CLI

```bash
# Из директории packages/ui
pnpm run add dialog
pnpm run add button
pnpm run add form

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

### Автоматизация (при использовании `pnpm run add`)

1. ✅ Компонент создается с помощью официального shadcn CLI
2. ✅ Файлы автоматически перемещаются в `src/components/ui/`
3. ✅ Экспорты автоматически добавляются в `src/index.ts`
4. ✅ Временные файлы очищаются

### Ручное добавление (при использовании `pnpm dlx`)

1. 📁 Переместите файлы из корня проекта в `src/components/ui/`
2. 📝 Добавьте экспорт в `src/index.ts`:
   ```ts
   export * from './components/ui/new-component';
   ```

### Дополнительно

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
