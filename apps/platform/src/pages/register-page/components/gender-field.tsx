import { Button, FormField, FormItem, FormMessage, Label } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function GenderField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <Label>
            {t('register.gender')} <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={field.value === 'male' ? 'default' : 'outline'}
              onClick={() => field.onChange('male')}
              className="flex-1"
            >
              {t('register.male')}
            </Button>
            <Button
              type="button"
              variant={field.value === 'female' ? 'default' : 'outline'}
              onClick={() => field.onChange('female')}
              className="flex-1"
            >
              {t('register.female')}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
