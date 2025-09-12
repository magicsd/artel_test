import { FormControl, FormField, FormItem, FormMessage, Input, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function LastNameField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')
  return (
    <FormField
      control={control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="lastName">
            {t('register.lastName')} <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <Input id="lastName" type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
