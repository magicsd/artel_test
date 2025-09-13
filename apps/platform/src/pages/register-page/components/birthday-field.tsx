import { DatePicker, FormControl, FormField, FormItem, FormMessage, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function BirthdayField() {
  const { control } = useFormContext()
  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="birthDate"
      render={({ field, fieldState }) => (
        <FormItem>
          <Label>
            {t('register.birthDate')} <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <DatePicker
              value={field.value}
              onChange={(date) => field.onChange(date)}
              invalid={!!fieldState.error}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
