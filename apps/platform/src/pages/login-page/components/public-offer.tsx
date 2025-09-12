import { useTranslation } from 'react-i18next'

export function PublicOffer() {
  const { t } = useTranslation('auth')

  return (
    <div className="text-muted-foreground mt-4 text-center text-xs text-balance">
      {t('login.agreement')}{' '}
      <a href="/cdn/files/Oferta_ArtelOnline.pdf" target="_blank" className="link">
        {t('login.offerAgreement')}
      </a>
      .
    </div>
  )
}
