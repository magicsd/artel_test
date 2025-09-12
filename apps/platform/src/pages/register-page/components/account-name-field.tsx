import { FormControl, FormField, FormItem, FormMessage, Input, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function AccountNameField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="accountName"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="accountName">{t('register.accountName')}</Label>
          <FormControl>
            <Input id="accountName" type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
