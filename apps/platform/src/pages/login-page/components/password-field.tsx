import { FormControl, FormField, FormItem, FormMessage, Input, Label } from '@artelonline/ui'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function PasswordField() {
  const [showPassword, setShowPassword] = useState(false)

  const { control } = useFormContext()

  const { t } = useTranslation('auth')

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('login.passwordLabel')}</Label>
            <Link to="/forgot-password" className="link text-sm">
              {t('login.forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <FormControl>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pr-10"
                {...field}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
