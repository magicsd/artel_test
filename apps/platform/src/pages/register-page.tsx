import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@artelonline/ui'
import { ArrowLeft, Check } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function RegisterPage() {
  const { t } = useTranslation('auth')
  const [formData, setFormData] = useState({
    accountName: '',
    lastName: '',
    firstName: '',
    middleName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    email: '',
    agreeToTerms: false,
    registerOrganization: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика регистрации
    console.log('Registration data:', formData)
  }

  // Генерация массивов для селектов
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
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
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <Link to="/login" className="link inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="size-4" />
            {t('register.backToLogin')}
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('register.title')}</CardTitle>
            <CardDescription>{t('register.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Имя аккаунта */}
              <div className="grid grid-cols-2 items-end gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="accountName">{t('register.accountName')}</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    type="text"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Пол */}
                <div className="grid gap-2">
                  <Label>
                    {t('register.gender')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.gender === 'male' ? 'default' : 'outline'}
                      onClick={() => handleGenderSelect('male')}
                      className="flex-1"
                    >
                      {t('register.male')}
                    </Button>
                    <Button
                      type="button"
                      variant={formData.gender === 'female' ? 'default' : 'outline'}
                      onClick={() => handleGenderSelect('female')}
                      className="flex-1"
                    >
                      {t('register.female')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Фамилия */}
              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  {t('register.lastName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Имя */}
              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  {t('register.firstName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Отчество */}
              <div className="grid gap-2">
                <Label htmlFor="middleName">{t('register.middleName')}</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Дата рождения */}
              <div className="grid gap-2">
                <Label>
                  {t('register.birthDate')} <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleInputChange}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">{t('register.dayPlaceholder')}</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleInputChange}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">{t('register.monthPlaceholder')}</option>
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">{t('register.yearPlaceholder')}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-600">{t('register.ageRequirement')}</p>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">
                  {t('register.email')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Чекбоксы */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="sr-only"
                      required
                    />
                    <div
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 ${
                        formData.agreeToTerms
                          ? 'border-primary bg-primary'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))
                      }
                    >
                      {formData.agreeToTerms && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <label htmlFor="agreeToTerms" className="cursor-pointer text-sm text-gray-700">
                    {t('register.agreeToTerms')}{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      {t('register.privacyPolicy')}
                    </Link>{' '}
                    {t('register.and')}{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      {t('register.termsOfUse')}
                    </Link>
                    {t('register.consentText')}{' '}
                    <Link to="/consent" className="text-primary hover:underline">
                      {t('register.personalDataConsent')}
                    </Link>
                    .
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="registerOrganization"
                      name="registerOrganization"
                      checked={formData.registerOrganization}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 ${
                        formData.registerOrganization
                          ? 'border-primary bg-primary'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          registerOrganization: !prev.registerOrganization,
                        }))
                      }
                    >
                      {formData.registerOrganization && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <label
                    htmlFor="registerOrganization"
                    className="cursor-pointer text-sm text-gray-700"
                  >
                    {t('register.registerOrganization')}
                  </label>
                </div>
              </div>

              {/* Кнопка регистрации */}
              <div className="flex justify-end">
                <Button type="submit" disabled={!formData.agreeToTerms}>
                  {t('register.registerButton')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
