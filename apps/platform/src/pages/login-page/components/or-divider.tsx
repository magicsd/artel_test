import { useTranslation } from 'react-i18next'

export function OrDivider() {
  const { t } = useTranslation('auth')

  return (
    <div className="after:border-border relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
      <span className="bg-card text-muted-foreground relative z-10 px-2 text-sm">
        {t('login.or')}
      </span>
    </div>
  )
}
