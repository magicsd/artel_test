#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, rmSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const component = process.argv[2];

if (!component) {
  console.error('Usage: node add-component.mjs <component-name>');
  process.exit(1);
}

try {
  // Выполняем shadcn CLI
  console.log(`Adding ${component} component...`);
  execSync(`pnpm dlx shadcn@latest add ${component}`, { stdio: 'inherit' });

  // Проверяем, создался ли файл в корне проекта
  const sourceDir = join(__dirname, '../../src/components/ui');
  const targetDir = join(__dirname, 'src/components/ui');
  
  if (existsSync(sourceDir)) {
    // Создаем целевую директорию если не существует
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    // Перемещаем файлы
    const files = execSync(`ls ${sourceDir}`, { encoding: 'utf8' }).trim().split('\n');
    
    for (const file of files) {
      if (file.endsWith('.tsx')) {
        const sourcePath = join(sourceDir, file);
        const targetPath = join(targetDir, file);
        
        console.log(`Moving ${file} to UI package...`);
        renameSync(sourcePath, targetPath);
        
        // Добавляем экспорт
        const componentName = file.replace('.tsx', '');
        const exportLine = `export * from "./components/ui/${componentName}";\n`;
        appendFileSync(join(__dirname, 'src/index.ts'), exportLine);
        
        console.log(`Added export for ${componentName}`);
      }
    }

    // Удаляем временную директорию
    rmSync(join(__dirname, '../../src'), { recursive: true, force: true });
    console.log('Cleaned up temporary files');
  }

  console.log(`✅ Component ${component} added successfully!`);
} catch (error) {
  console.error('Error adding component:', error.message);
  process.exit(1);
}

