import { FormControl, FormField, FormItem, FormMessage, Input, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function FirstNameField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="firstName">
            {t('register.firstName')} <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <Input id="firstName" type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
