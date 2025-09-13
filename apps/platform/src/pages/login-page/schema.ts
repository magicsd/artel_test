import { z } from 'zod'

// Login schema and types
export const loginSchema = z.object({
  username: z.string().min(1, 'Введите логин').max(100, 'Слишком длинный логин'),
  password: z.string().min(6, 'Минимум 6 символов').max(200, 'Слишком длинный пароль'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
