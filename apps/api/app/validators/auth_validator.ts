import vine from '@vinejs/vine'
import { uniqueRule } from '#validators/rules/unique'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().minLength(8).maxLength(255).confirmed(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(1),
  })
)
