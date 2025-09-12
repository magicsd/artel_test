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
  toast,
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
    try {
      await mutateAsync(formData)
      navigate('/')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleTelegramLogin = () => {
    // Здесь будет логика авторизации через Telegram
    console.log('Telegram login')
  }

  return (
    <div className="bg-foreground/5 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img
            className="w-72 sm:w-80"
            src="https://lk.artelonline.ru/cdn/img/logo/artelonline.svg"
            alt=""
          />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('login.title')}</CardTitle>
            <CardDescription>{t('login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Button onClick={handleTelegramLogin} variant="outline">
                <Send />
                {t('login.telegramButton')}
              </Button>

              <div className="after:border-border relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2 text-sm">
                  {t('login.or')}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login">{t('login.loginLabel')}</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                  <Link to="/forgot-password" className="link text-sm">
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
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit">{t('login.loginButton')}</Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">
                {t('login.noAccount')}{' '}
              </span>
              <Link to="/register" className="link-underline">
                {t('login.createAccount')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-muted-foreground mt-4 text-center text-xs text-balance">
          {t('login.agreement')}{' '}
          <a href="/cdn/files/Oferta_ArtelOnline.pdf" target="_blank" className="link">
            {t('login.offerAgreement')}
          </a>
          .
        </div>
      </div>
    </div>
  )
}
