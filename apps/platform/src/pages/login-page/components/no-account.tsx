import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function NoAccount() {
  const { t } = useTranslation('auth')

  return (
    <div className="text-center text-sm">
      <span className="text-muted-foreground">{t('login.noAccount')} </span>
      <Link to="/register" className="link-underline">
        {t('login.createAccount')}
      </Link>
    </div>
  )
}
