import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@artelonline/ui'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад на главную
            </Link>
          </Button>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">О платформе</h1>
          <p className="text-xl text-gray-600">
            Современное решение для разработки масштабируемых веб-приложений
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Технологический стек</CardTitle>
              <CardDescription>Современные инструменты разработки</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
                  React 18 с TypeScript
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
                  Nx монорепозиторий
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-purple-500"></span>
                  Tailwind CSS 4
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-orange-500"></span>
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
                  <span className="mr-3 h-2 w-2 rounded-full bg-red-500"></span>
                  Роутинг с React Router
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-yellow-500"></span>
                  Интернационализация
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-indigo-500"></span>
                  Тестирование с Vitest
                </li>
                <li className="flex items-center">
                  <span className="mr-3 h-2 w-2 rounded-full bg-pink-500"></span>
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
            <div className="overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
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
  )
}
