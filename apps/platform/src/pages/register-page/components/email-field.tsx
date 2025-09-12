import { FormControl, FormField, FormItem, FormMessage, Input, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function EmailField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="email">
            {t('register.email')} <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <Input id="email" type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
