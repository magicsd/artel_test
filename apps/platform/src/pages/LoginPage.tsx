import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@frontend/ui'
import { Eye, EyeOff, Send } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика авторизации
    console.log('Login data:', formData)
  }

  const handleTelegramLogin = () => {
    // Здесь будет логика авторизации через Telegram
    console.log('Telegram login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <div className="text-white text-2xl font-bold">А</div>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">АртельОнлайн</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Рады видеть вас снова</CardTitle>
            <CardDescription className="text-gray-600">Войдите через аккаунт Telegram</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Кнопка входа через Telegram */}
            <Button
              onClick={handleTelegramLogin}
              variant="outline"
              className="w-full h-12 text-base font-medium"
            >
              <Send className="w-5 h-5 mr-2" />
              Войти через Telegram
            </Button>

            {/* Разделитель */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">или</span>
              </div>
            </div>

            {/* Форма входа */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Логин / Email / Телефон</Label>
                <div className="relative">
                  <Input
                    id="login"
                    name="login"
                    type="text"
                    value={formData.login}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <div className="w-2 h-2 bg-white rounded-full ml-0.5" />
                      <div className="w-2 h-2 bg-white rounded-full ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Пароль</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Забыли пароль?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-medium">
                Войти
              </Button>
            </form>

            {/* Ссылка на регистрацию */}
            <div className="text-center">
              <span className="text-gray-600">Нет аккаунта? </span>
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Создать
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Соглашение */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Используя сервис АртельОнлайн, вы <br />
          соглашаетесь с условиями{' '}
          <Link to="/terms" className="text-blue-600 hover:underline">
            договора оферты
          </Link>
          .
        </div>
      </div>
    </div>
  )
}

