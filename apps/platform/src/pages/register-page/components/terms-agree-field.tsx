import { Checkbox, FormControl, FormField, FormItem, FormMessage } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function TermsAgreeField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="agreeToTerms"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                id="agreeToTerms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              />
            </FormControl>
            <label htmlFor="agreeToTerms" className="text-muted-foreground cursor-pointer text-sm">
              {t('register.agreeToTerms')}{' '}
              <Link to="/privacy" className="link">
                {t('register.privacyPolicy')}
              </Link>{' '}
              {t('register.and')}{' '}
              <Link to="/terms" className="link">
                {t('register.termsOfUse')}
              </Link>
              {t('register.consentText')}{' '}
              <Link to="/consent" className="link">
                {t('register.personalDataConsent')}
              </Link>
              .
            </label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
