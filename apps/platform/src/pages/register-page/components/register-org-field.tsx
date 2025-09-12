import { Checkbox, FormControl, FormField, FormItem, FormMessage } from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function RegisterOrgField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="registerOrganization"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                id="registerOrganization"
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              />
            </FormControl>
            <label
              htmlFor="registerOrganization"
              className="text-muted-foreground cursor-pointer text-sm"
            >
              {t('register.registerOrganization')}
            </label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
