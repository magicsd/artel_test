#!/bin/bash

# Скрипт для добавления shadcn/ui компонентов в UI пакет
# Использование: ./scripts/add-ui-component.sh <component-name>
# Пример: ./scripts/add-ui-component.sh dialog

set -e

# Проверка аргументов
if [ $# -eq 0 ]; then
    echo "❌ Ошибка: Не указано имя компонента"
    echo "📖 Использование: $0 <component-name>"
    echo "📖 Пример: $0 dialog"
    echo ""
    echo "📋 Доступные компоненты:"
    echo "   accordion, alert, alert-dialog, aspect-ratio, avatar, badge,"
    echo "   breadcrumb, button, calendar, card, carousel, checkbox,"
    echo "   collapsible, combobox, command, context-menu, data-table,"
    echo "   date-picker, dialog, drawer, dropdown-menu, form, hover-card,"
    echo "   input, input-otp, label, menubar, navigation-menu, pagination,"
    echo "   popover, progress, radio-group, resizable, scroll-area,"
    echo "   select, separator, sheet, skeleton, slider, sonner, switch,"
    echo "   table, tabs, textarea, toast, toggle, toggle-group,"
    echo "   tooltip, typography"
    exit 1
fi

COMPONENT_NAME="$1"
UI_DIR="packages/ui"

echo "🚀 Добавление компонента '$COMPONENT_NAME' в UI пакет..."

# Переход в директорию UI пакета
cd "$UI_DIR"

# Проверка существования components.json
if [ ! -f "components.json" ]; then
    echo "❌ Ошибка: Файл components.json не найден в $UI_DIR"
    exit 1
fi

# Создание директории ui если не существует
mkdir -p src/components/ui

# Добавление компонента через shadcn CLI
echo "📦 Выполнение: npx shadcn@latest add $COMPONENT_NAME"
npx shadcn@latest add "$COMPONENT_NAME" --yes

# Проверка успешности добавления
if [ $? -eq 0 ]; then
    echo "✅ Компонент '$COMPONENT_NAME' успешно добавлен!"
    
    # Перемещение файлов из корневой директории в правильное место
    cd ../..
    if [ -d "src/components/ui" ]; then
        echo "📁 Перемещение файлов в правильную директорию..."
        mv src/components/ui/* packages/ui/src/components/ui/ 2>/dev/null || true
        rm -rf src
    fi
    
    cd "$UI_DIR"
    
    # Обновление экспортов в index.ts
    echo "📝 Обновление экспортов в src/index.ts..."
    
    # Создание временного файла с обновленными экспортами
    {
        echo "// UI Components"
        find src/components -name "*.tsx" -not -name "*.stories.tsx" -not -name "*.test.tsx" | while read file; do
            component_file=$(basename "$file" .tsx)
            echo "export * from './components/$component_file';"
        done
        
        # Добавление экспортов из ui директории
        if [ -d "src/components/ui" ]; then
            find src/components/ui -name "*.tsx" | while read file; do
                component_file=$(basename "$file" .tsx)
                echo "export * from './components/ui/$component_file';"
            done
        fi
        
        echo ""
        echo "// Utilities"
        echo "export * from './lib/utils';"
        echo ""
        echo "// Styles"
        echo "export './globals.css';"
    } > src/index.ts.tmp
    
    mv src/index.ts.tmp src/index.ts
    
    echo "✅ Экспорты обновлены!"
    
    # Возврат в корневую директорию
    cd ../..
    
    echo ""
    echo "🎉 Готово! Компонент '$COMPONENT_NAME' добавлен в UI пакет."
    echo "📁 Файлы созданы в: $UI_DIR/src/components/"
    echo "📝 Экспорты обновлены в: $UI_DIR/src/index.ts"
    echo ""
    echo "🔄 Следующие шаги:"
    echo "   1. Проверьте созданные файлы"
    echo "   2. При необходимости создайте Storybook stories"
    echo "   3. Добавьте тесты для компонента"
    echo "   4. Закоммитьте изменения: git add . && git commit -m \"feat: add $COMPONENT_NAME component\""
    
else
    echo "❌ Ошибка при добавлении компонента '$COMPONENT_NAME'"
    exit 1
fi

