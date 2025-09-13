import { useTranslation } from 'react-i18next'

export function OrDivider() {
  const { t } = useTranslation('auth')

  return (
    <div className="flex items-center gap-2">
      <hr className="h-px flex-1" />
      <span className="text-muted-foreground text-sm">{t('login.or')}</span>
      <hr className="h-px flex-1" />
    </div>
  )
}
