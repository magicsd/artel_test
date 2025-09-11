import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@frontend/ui';
import { useTranslation } from '@frontend/shared';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {t('welcome')} 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Добро пожаловать в современную платформу, построенную с использованием Nx, React, и Tailwind CSS 4
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Современная архитектура</h3>
            <p className="text-gray-600">Nx монорепозиторий с React приложениями</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">UI компоненты</h3>
            <p className="text-gray-600">shadcn/ui с Tailwind CSS 4</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold mb-2">Интернационализация</h3>
            <p className="text-gray-600">Поддержка множественных языков</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/about">О платформе</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/dashboard">Перейти к дашборду</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

