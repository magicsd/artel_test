import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
} from '@artelonline/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArtelBanner } from '../../components'
import {
  AccountNameField,
  BirthdayField,
  EmailField,
  FirstNameField,
  GenderField,
  LastNameField,
  MiddleNameField,
  RegisterOrgField,
  TermsAgreeField,
} from './components'
import { registerSchema, type RegisterFormValues } from './schema'

export function RegisterPage() {
  const { t } = useTranslation('auth')

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountName: '',
      lastName: '',
      firstName: '',
      middleName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      email: '',
      agreeToTerms: false,
      registerOrganization: false,
    },
    mode: 'onSubmit',
  })

  const onSubmit = (values: RegisterFormValues) => {
    console.log('Registration data:', values)
  }

  return (
    <div className="bg-foreground/5 grid min-h-screen place-items-center px-4 pt-4 pb-8 md:pt-8 md:pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="link" asChild>
            <Link to="/login">
              <ArrowLeft className="size-4" />
              {t('register.backToLogin')}
            </Link>
          </Button>
          <div className="flex justify-center">
            <Link to="/">
              <ArtelBanner className="w-32 sm:w-40" />
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('register.title')}</CardTitle>
            <CardDescription>{t('register.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid items-start gap-4 md:grid-cols-3">
                  <AccountNameField />
                  <EmailField />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <LastNameField />
                  <FirstNameField />
                  <MiddleNameField />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <BirthdayField />
                  <GenderField />
                </div>

                <div className="grid gap-4">
                  <TermsAgreeField />
                  <RegisterOrgField />
                </div>

                {/* Кнопка регистрации */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!form.watch('agreeToTerms') || form.formState.isSubmitting}
                  >
                    {t('register.registerButton')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
