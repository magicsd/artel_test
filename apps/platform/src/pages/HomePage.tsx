import { useTranslation } from '@artelonline/shared'
import { Button } from '@artelonline/ui'
import React from 'react'
import { Link } from 'react-router-dom'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">{t('welcome')} 👋</h1>
          <p className="mb-8 text-xl text-gray-600">
            Добро пожаловать в современную платформу, построенную с использованием Nx, React, и
            Tailwind CSS 4
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-3xl">🚀</div>
            <h3 className="mb-2 text-lg font-semibold">Современная архитектура</h3>
            <p className="text-gray-600">Nx монорепозиторий с React приложениями</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-3xl">🎨</div>
            <h3 className="mb-2 text-lg font-semibold">UI компоненты</h3>
            <p className="text-gray-600">shadcn/ui с Tailwind CSS 4</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-3xl">🌍</div>
            <h3 className="mb-2 text-lg font-semibold">Интернационализация</h3>
            <p className="text-gray-600">Поддержка множественных языков</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/about">О платформе</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/dashboard">Перейти к дашборду</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
