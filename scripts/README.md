# UI Component Scripts

Скрипты для управления shadcn/ui компонентами в монорепозитории.

## Доступные скрипты

### 🔧 add-ui-component.sh

Добавляет отдельный shadcn/ui компонент в UI пакет.

**Использование:**
```bash
./scripts/add-ui-component.sh <component-name>
```

**Примеры:**
```bash
# Добавить диалог
./scripts/add-ui-component.sh dialog

# Добавить форму
./scripts/add-ui-component.sh form

# Добавить таблицу
./scripts/add-ui-component.sh table
```

**Что делает скрипт:**
- Добавляет компонент через shadcn CLI
- Автоматически обновляет экспорты в `packages/ui/src/index.ts`
- Показывает инструкции для следующих шагов

### 🚀 setup-ui-components.sh

Массово добавляет все популярные компоненты для современной платформы.

**Использование:**
```bash
./scripts/setup-ui-components.sh
```

**Добавляемые компоненты:**
- **Формы:** dialog, form, select, textarea, checkbox, radio-group, switch
- **Навигация:** tabs, navigation-menu, breadcrumb, pagination
- **Обратная связь:** toast, alert, badge, skeleton, progress
- **Отображение данных:** table, avatar, separator, tooltip
- **Интерактивность:** popover, sheet, dropdown-menu, combobox
- **Дата и время:** calendar, date-picker
- **И многие другие...

## Требования

- Node.js и pnpm установлены
- shadcn CLI доступен (`npx shadcn@latest`)
- Корректно настроенный `components.json` в `packages/ui/`

## Структура после выполнения

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ... (другие компоненты)
│   ├── index.ts          # Автоматически обновляется
│   └── globals.css
└── components.json
```

## Troubleshooting

### Ошибка "components.json не найден"
Убедитесь, что файл `packages/ui/components.json` существует и корректно настроен.

### Ошибка "shadcn command not found"
Установите shadcn CLI:
```bash
npm install -g @shadcn/ui
```

### Компонент уже существует
Скрипт пропустит уже существующие компоненты и продолжит работу.

## Следующие шаги после добавления компонентов

1. **Проверьте созданные файлы:**
   ```bash
   ls packages/ui/src/components/
   ```

2. **Запустите Storybook для тестирования:**
   ```bash
   cd packages/ui
   pnpm storybook
   ```

3. **Создайте stories для новых компонентов:**
   ```bash
   # Пример для dialog компонента
   touch packages/ui/src/components/dialog.stories.tsx
   ```

4. **Добавьте тесты:**
   ```bash
   # Пример для dialog компонента
   touch packages/ui/src/components/dialog.test.tsx
   ```

5. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "feat: add UI components via scripts"
   git push origin main
   ```

