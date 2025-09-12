import { useLogin } from '@artelonline/shared'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@artelonline/ui'
import { Eye, EyeOff, Send } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

export function LoginPage() {
  const { t } = useTranslation('auth')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const { mutateAsync } = useLogin()

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика авторизации
    console.log('Login data:', formData)
    await mutateAsync(formData)
    navigate('/')
  }

  const handleTelegramLogin = () => {
    // Здесь будет логика авторизации через Telegram
    console.log('Telegram login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="mb-8 text-center">
          <div className="bg-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <div className="text-2xl font-bold text-white">А</div>
          </div>
          <h1 className="text-primary text-2xl font-bold">АртельОнлайн</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">{t('login.title')}</CardTitle>
            <CardDescription className="text-gray-600">{t('login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Кнопка входа через Telegram */}
            <Button
              onClick={handleTelegramLogin}
              variant="outline"
              className="h-12 w-full text-base font-medium"
            >
              <Send className="mr-2 h-5 w-5" />
              {t('login.telegramButton')}
            </Button>

            {/* Разделитель */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">{t('login.or')}</span>
              </div>
            </div>

            {/* Форма входа */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">{t('login.loginLabel')}</Label>
                <div className="relative">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      <div className="ml-0.5 h-2 w-2 rounded-full bg-white" />
                      <div className="ml-0.5 h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                  <Link to="/forgot-password" className="text-primary text-sm hover:underline">
                    {t('login.forgotPassword')}
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
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit">{t('login.loginButton')}</Button>
            </form>

            {/* Ссылка на регистрацию */}
            <div className="text-center">
              <span className="text-gray-600">{t('login.noAccount')} </span>
              <Link to="/register" className="text-primary font-medium hover:underline">
                {t('login.createAccount')}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Соглашение */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {t('login.agreement')} <br />
          <Link to="/terms" className="text-primary hover:underline">
            {t('login.offerAgreement')}
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
