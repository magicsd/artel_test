import { Button, FormField, FormItem, FormMessage, Label } from '@artelonline/ui'
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function GenderField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="gender"
      render={({ field, fieldState }) => (
        <FormItem>
          <Label>
            {t('register.gender')} <span className="text-red-500">*</span>
          </Label>
          <div
            className={clsx('bg-foreground/5 flex gap-1 rounded-lg p-0.5 transition-colors', {
              'ring ring-red-500': fieldState.error,
            })}
          >
            <Button
              size="sm"
              type="button"
              variant={field.value === 'male' ? 'default' : 'outline'}
              onClick={() => field.onChange('male')}
              className="flex-1"
            >
              {t('register.male')}
            </Button>
            <Button
              size="sm"
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
