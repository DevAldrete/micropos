import vine from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().maxLength(255).optional().nullable(),
    phone: vine.string().trim().maxLength(50).optional().nullable(),
  })
)

export const updateCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().maxLength(255).optional().nullable(),
    phone: vine.string().trim().maxLength(50).optional().nullable(),
  })
)
