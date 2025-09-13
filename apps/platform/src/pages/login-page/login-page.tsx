import { useLogin } from '@artelonline/shared'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
  Form,
} from '@artelonline/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ArtelBanner } from '../../components'
import { LoginField, NoAccount, OrDivider, PasswordField, PublicOffer } from './components'
import { loginSchema, type LoginFormValues } from './schema'

export function LoginPage() {
  const { t } = useTranslation(['auth', 'common'])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onSubmit',
  })

  const { mutateAsync } = useLogin()

  const navigate = useNavigate()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await mutateAsync(values)
      navigate('/')
      toast.success(t('login.successMessage'))
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleTelegramLogin = () => {
    // Здесь будет логика авторизации через Telegram
    console.log('Telegram login')
  }

  return (
    <div className="bg-foreground/5 flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <ArtelBanner className="w-64 sm:w-80" />
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('login.title')}</CardTitle>
            <CardDescription>{t('login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <LoginField />
                <PasswordField />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {t('login.loginButton')}
                </Button>
              </form>
            </Form>
            <OrDivider />

            <Button onClick={handleTelegramLogin} variant="outline">
              <Send />
              {t('login.telegramButton')}
            </Button>

            <NoAccount />
          </CardContent>
        </Card>

        <PublicOffer />
      </div>
    </div>
  )
}
