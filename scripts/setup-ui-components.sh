#!/bin/bash

# Скрипт для массового добавления популярных shadcn/ui компонентов
# Использование: ./scripts/setup-ui-components.sh

set -e

echo "🚀 Настройка UI компонентов для современной платформы..."

# Список популярных компонентов для платформы
COMPONENTS=(
    "dialog"
    "dropdown-menu"
    "form"
    "select"
    "textarea"
    "checkbox"
    "radio-group"
    "switch"
    "tabs"
    "toast"
    "alert"
    "badge"
    "avatar"
    "separator"
    "skeleton"
    "progress"
    "tooltip"
    "popover"
    "sheet"
    "navigation-menu"
    "breadcrumb"
    "pagination"
    "table"
    "calendar"
    "date-picker"
    "combobox"
    "command"
    "scroll-area"
    "resizable"
    "toggle"
    "slider"
    "aspect-ratio"
    "collapsible"
    "context-menu"
    "hover-card"
    "menubar"
    "accordion"
    "alert-dialog"
    "carousel"
    "drawer"
    "input-otp"
    "sonner"
    "toggle-group"
    "typography"
)

echo "📦 Будет добавлено ${#COMPONENTS[@]} компонентов..."
echo ""

# Счетчик для отслеживания прогресса
count=0
total=${#COMPONENTS[@]}

# Добавление каждого компонента
for component in "${COMPONENTS[@]}"; do
    count=$((count + 1))
    echo "[$count/$total] Добавление компонента: $component"
    
    # Вызов скрипта добавления компонента
    if ./scripts/add-ui-component.sh "$component" > /dev/null 2>&1; then
        echo "  ✅ $component добавлен успешно"
    else
        echo "  ⚠️  $component - возможно уже существует или произошла ошибка"
    fi
    
    # Небольшая пауза между компонентами
    sleep 0.5
done

echo ""
echo "🎉 Настройка UI компонентов завершена!"
echo ""
echo "📊 Статистика:"
echo "   • Обработано компонентов: $total"
echo "   • Создано файлов в: packages/ui/src/components/"
echo "   • Обновлены экспорты в: packages/ui/src/index.ts"
echo ""
echo "🔄 Следующие шаги:"
echo "   1. Проверьте созданные компоненты: ls packages/ui/src/components/"
echo "   2. Запустите Storybook: cd packages/ui && pnpm storybook"
echo "   3. Протестируйте компоненты в приложении"
echo "   4. Закоммитьте изменения: git add . && git commit -m \"feat: add comprehensive UI component library\""
echo ""
echo "📚 Документация компонентов: https://ui.shadcn.com/docs/components"

