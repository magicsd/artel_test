import { isBefore } from 'date-fns/isBefore'
import { subYears } from 'date-fns/subYears'
import { z } from 'zod'

export type Gender = 'male' | 'female'

const today = new Date()
const maxDate = subYears(today, 16)

export const registerSchema = z.object({
  accountName: z.string().min(3, 'Минимум 3 символа').max(50, 'Максимум 50 символов'),
  lastName: z.string().min(1, 'Обязательное поле'),
  firstName: z.string().min(1, 'Обязательное поле'),

  middleName: z.string().optional(),

  birthDate: z
    .date('Обязательное поле')
    .refine((d) => isBefore(d, maxDate), 'Возраст должен быть не младше 16 лет'),

  gender: z.enum<Gender[]>(['male', 'female'], 'Выберите пол'),

  email: z.email('Некорректный email'),

  agreeToTerms: z.boolean().refine((val) => val === true, 'Требуется согласие'),

  registerOrganization: z.boolean().optional(),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
