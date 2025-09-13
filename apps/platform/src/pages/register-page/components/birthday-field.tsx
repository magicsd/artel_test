import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DatePicker,
} from '@artelonline/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { days, makeYears } from '../../constants/date'

const years = makeYears(100)

export function BirthdayField() {
  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  const months = [
    t('months.january'),
    t('months.february'),
    t('months.march'),
    t('months.april'),
    t('months.may'),
    t('months.june'),
    t('months.july'),
    t('months.august'),
    t('months.september'),
    t('months.october'),
    t('months.november'),
    t('months.december'),
  ]

  return (
    <div className="grid gap-2">
      <Label>
        {t('register.birthDate')} <span className="text-red-500">*</span>
      </Label>
      <DatePicker />
    </div>
  )

  return (
    <div className="grid gap-2">
      <Label>
        {t('register.birthDate')} <span className="text-red-500">*</span>
      </Label>
      <div className="grid grid-cols-3 items-start gap-4">
        <FormField
          control={control}
          name="birthDay"
          render={({ field, fieldState }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className={fieldState.error ? 'border-red-500' : undefined}>
                    <SelectValue placeholder={t('register.dayPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="birthMonth"
          render={({ field, fieldState }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className={fieldState.error ? 'border-red-500' : undefined}>
                    <SelectValue placeholder={t('register.monthPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={String(index + 1)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="birthYear"
          render={({ field, fieldState }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className={fieldState.error ? 'border-red-500' : undefined}>
                    <SelectValue placeholder={t('register.yearPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{t('register.ageRequirement')}</p>
    </div>
  )
}
