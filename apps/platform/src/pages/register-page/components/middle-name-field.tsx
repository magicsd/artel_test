import { FormControl, FormField, FormItem, FormMessage, Input, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function MiddleNameField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')
  return (
    <FormField
      control={control}
      name="middleName"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="middleName">{t('register.middleName')}</Label>
          <FormControl>
            <Input id="middleName" type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
