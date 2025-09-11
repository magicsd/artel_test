#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Получаем имя компонента из аргументов
const componentName = process.argv[2]

if (!componentName) {
  console.error('❌ Ошибка: Не указано имя компонента')
  console.log('📖 Использование: pnpm nx add:ui <component-name>')
  console.log('📖 Пример: pnpm nx add:ui dialog')
  console.log('')
  console.log('📋 Доступные компоненты:')
  console.log('   button, card, input, label, form, dialog, select, textarea,')
  console.log('   checkbox, radio-group, switch, tabs, table, toast, tooltip,')
  console.log('   popover, dropdown-menu, navigation-menu, sheet, alert,')
  console.log('   alert-dialog, badge, avatar, skeleton, progress, slider,')
  console.log('   separator, accordion, collapsible, command, combobox,')
  console.log('   calendar, date-picker')
  process.exit(1)
}

const uiPackagePath = join(projectRoot, 'packages/ui')
const componentsPath = join(uiPackagePath, 'src/components/ui')
const indexPath = join(uiPackagePath, 'src/index.ts')

console.log(`🚀 Добавление компонента '${componentName}' в UI пакет...`)

try {
  // Переходим в директорию UI пакета
  process.chdir(uiPackagePath)
  
  // Создаем директорию ui если не существует
  if (!existsSync(componentsPath)) {
    mkdirSync(componentsPath, { recursive: true })
  }
  
  // Выполняем команду shadcn add
  console.log(`📦 Выполнение: npx shadcn@latest add ${componentName}`)
  execSync(`npx shadcn@latest add ${componentName} --yes`, { 
    stdio: 'inherit',
    cwd: uiPackagePath 
  })
  
  // Проверяем, создались ли файлы в корне проекта
  const rootSrcPath = join(projectRoot, 'src/components/ui')
  if (existsSync(rootSrcPath)) {
    console.log('📁 Перемещение файлов в правильную директорию...')
    
    // Перемещаем файлы из корня в UI пакет
    execSync(`mv ${rootSrcPath}/* ${componentsPath}/`, { stdio: 'inherit' })
    
    // Удаляем временную директорию
    execSync(`rm -rf ${join(projectRoot, 'src')}`, { stdio: 'inherit' })
  }
  
  // Обновляем экспорты в index.ts
  console.log('📝 Обновление экспортов в src/index.ts...')
  
  // Читаем текущий index.ts
  let indexContent = ''
  if (existsSync(indexPath)) {
    indexContent = readFileSync(indexPath, 'utf8')
  }
  
  // Добавляем экспорт для нового компонента, если его еще нет
  const exportLine = `export * from './components/ui/${componentName}';`
  if (!indexContent.includes(exportLine)) {
    // Находим секцию UI Components или создаем ее
    if (!indexContent.includes('// UI Components')) {
      indexContent = '// UI Components\n' + indexContent
    }
    
    // Добавляем экспорт после заголовка UI Components
    const lines = indexContent.split('\n')
    const uiComponentsIndex = lines.findIndex(line => line.includes('// UI Components'))
    
    if (uiComponentsIndex !== -1) {
      lines.splice(uiComponentsIndex + 1, 0, exportLine)
      indexContent = lines.join('\n')
    } else {
      indexContent = exportLine + '\n' + indexContent
    }
    
    writeFileSync(indexPath, indexContent)
  }
  
  console.log('✅ Экспорты обновлены!')
  
  console.log('')
  console.log(`🎉 Готово! Компонент '${componentName}' добавлен в UI пакет.`)
  console.log(`📁 Файлы созданы в: packages/ui/src/components/ui/`)
  console.log(`📝 Экспорты обновлены в: packages/ui/src/index.ts`)
  console.log('')
  console.log('🔄 Следующие шаги:')
  console.log('   1. Проверьте созданные файлы')
  console.log('   2. При необходимости создайте Storybook stories')
  console.log('   3. Добавьте тесты для компонента')
  console.log(`   4. Закоммитьте изменения: git add . && git commit -m "feat: add ${componentName} component"`)
  
} catch (error) {
  console.error(`❌ Ошибка при добавлении компонента '${componentName}':`, error.message)
  process.exit(1)
}

