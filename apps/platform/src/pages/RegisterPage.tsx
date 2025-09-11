import { Button, Card, CardContent, Input, Label } from '@artelonline/ui'
import { ArrowLeft, Check } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const RegisterPage: React.FC = () => {
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

  const checkAccountName = () => {
    // Здесь будет логика проверки имени аккаунта
    console.log('Checking account name:', formData.accountName)
  }

  // Генерация массивов для селектов
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Заголовок */}
        <div className="mb-8">
          <Link
            to="/login"
            className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к входу
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Регистрация</h1>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Имя аккаунта */}
              <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                <div className="md:col-span-3">
                  <Label htmlFor="accountName">
                    Имя аккаунта <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    type="text"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={checkAccountName}
                  variant="secondary"
                  className="h-10"
                >
                  Проверить
                </Button>
              </div>

              {/* Фамилия */}
              <div>
                <Label htmlFor="lastName">
                  Фамилия <span className="text-red-500">*</span>
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
              <div>
                <Label htmlFor="firstName">
                  Имя <span className="text-red-500">*</span>
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
              <div>
                <Label htmlFor="middleName">Отчество</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Дата рождения */}
              <div>
                <Label>
                  Дата рождения <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <select
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleInputChange}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">день</option>
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
                    <option value="">месяц</option>
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
                    <option value="">год</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-600">Вам должно исполниться 16 лет</p>
              </div>

              {/* Пол */}
              <div>
                <Label>
                  Пол <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2 flex gap-4">
                  <Button
                    type="button"
                    variant={formData.gender === 'male' ? 'default' : 'outline'}
                    onClick={() => handleGenderSelect('male')}
                    className="flex-1"
                  >
                    мужской
                  </Button>
                  <Button
                    type="button"
                    variant={formData.gender === 'female' ? 'default' : 'outline'}
                    onClick={() => handleGenderSelect('female')}
                    className="flex-1"
                  >
                    женский
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">
                  Адрес электронной почты <span className="text-red-500">*</span>
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
                          ? 'border-blue-600 bg-blue-600'
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
                    Соглашаюсь с{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      условиями конфиденциальности
                    </Link>{' '}
                    и{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      условиями пользования сайта
                    </Link>
                    , а также даю{' '}
                    <Link to="/consent" className="text-blue-600 hover:underline">
                      добровольное согласие на использование моих персональных данных
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
                          ? 'border-blue-600 bg-blue-600'
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
                    Также зарегистрировать свою организацию
                  </label>
                </div>
              </div>

              {/* Кнопка регистрации */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-yellow-600 px-8 py-3 font-medium text-white hover:bg-yellow-700"
                  disabled={!formData.agreeToTerms}
                >
                  Зарегистрироваться
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
