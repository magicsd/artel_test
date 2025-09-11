import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@frontend/ui';
import { ArrowLeft } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад на главную
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">О платформе</h1>
          <p className="text-xl text-gray-600">
            Современное решение для разработки масштабируемых веб-приложений
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Технологический стек</CardTitle>
              <CardDescription>Современные инструменты разработки</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  React 18 с TypeScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Nx монорепозиторий
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Tailwind CSS 4
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  shadcn/ui компоненты
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Возможности</CardTitle>
              <CardDescription>Что включено в платформу</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Роутинг с React Router
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Интернационализация
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Тестирование с Vitest
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Storybook для UI
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Архитектура проекта</CardTitle>
            <CardDescription>Структура монорепозитория</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`/
├── apps/
│   ├── platform/      # SPA приложение (текущее)
│   ├── telegram/      # Telegram Mini App
│   └── marketing/     # Маркетинговый сайт
├── packages/
│   ├── ui/            # shadcn/ui компоненты + Storybook
│   ├── shared/        # Общие утилиты + i18n
│   └── config/        # Конфигурации
└── pnpm-workspace.yaml`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

