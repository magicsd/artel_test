import { FormControl, FormField, FormItem, FormMessage, Input, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function LoginField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="username">{t('login.loginLabel')}</Label>
          <FormControl>
            <Input id="username" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
