import { differenceInYears } from 'date-fns/differenceInYears'
import { isExists } from 'date-fns/isExists'
import { startOfToday } from 'date-fns/startOfToday'
import { z } from 'zod'

export type Gender = 'male' | 'female'

export const registerSchema = z
  .object({
    accountName: z.string().min(3, 'Минимум 3 символа').max(50, 'Максимум 50 символов'),
    lastName: z.string().min(1, 'Обязательное поле'),
    firstName: z.string().min(1, 'Обязательное поле'),

    middleName: z.string().optional(),

    birthDay: z.string().min(1, 'День обязателен'),
    birthMonth: z.string().min(1, 'Месяц обязателен'),
    birthYear: z.string().min(1, 'Год обязателен'),

    gender: z.enum<Gender[]>(['male', 'female'], 'Выберите пол'),

    email: z.email('Некорректный email'),

    agreeToTerms: z.boolean().refine((val) => val === true, 'Требуется согласие'),

    registerOrganization: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    const dayNum = Number(val.birthDay)
    const monthNum = Number(val.birthMonth)
    const yearNum = Number(val.birthYear)

    if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 31) {
      ctx.addIssue({
        code: 'custom',
        message: 'Некорректный день',
        path: ['birthDay'],
      })
      return
    }

    if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
      ctx.addIssue({
        code: 'custom',
        message: 'Некорректный месяц',
        path: ['birthMonth'],
      })
      return
    }

    const currentYear = new Date().getFullYear()
    if (!Number.isInteger(yearNum) || yearNum < currentYear - 120 || yearNum > currentYear) {
      ctx.addIssue({
        code: 'custom',
        message: 'Некорректный год',
        path: ['birthYear'],
      })
      return
    }

    const month = monthNum - 1
    if (!isExists(yearNum, month, dayNum)) {
      ctx.addIssue({ code: 'custom', message: 'Некорректная дата', path: ['birthDay'] })
      return
    }
    const birthDate = new Date(yearNum, month, dayNum)

    const today = startOfToday()
    const age = differenceInYears(today, birthDate)

    if (age < 16) {
      ctx.addIssue({
        code: 'custom',
        message: 'Возраст должен быть 16+',
        path: ['birthYear'],
      })
    }
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
