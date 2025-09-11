import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@artelonline/ui'
import { ArrowRight, Users, Zap, Shield, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
        <div className="container mx-auto py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{t('hero.title')}</h1>
            <p className="text-muted-foreground mt-6 text-lg leading-8">{t('hero.subtitle')}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link to="/register">
                  {t('getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">{t('learnMore')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('features.title')}</h2>
            <p className="text-muted-foreground mt-6 text-lg leading-8">{t('features.subtitle')}</p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Users className="text-primary h-8 w-8" />
                  <CardTitle className="text-lg">{t('features.collaboration')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('features.collaborationDesc')}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="text-primary h-8 w-8" />
                  <CardTitle className="text-lg">{t('features.performance')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('features.performanceDesc')}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="text-primary h-8 w-8" />
                  <CardTitle className="text-lg">{t('features.security')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('features.securityDesc')}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="text-primary h-8 w-8" />
                  <CardTitle className="text-lg">{t('features.global')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('features.globalDesc')}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="container mx-auto py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="text-primary-foreground/80 mt-6 text-lg leading-8">{t('cta.subtitle')}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">{t('signUpNow')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">{t('signIn')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
