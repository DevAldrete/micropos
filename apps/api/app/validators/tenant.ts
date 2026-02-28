import vine from '@vinejs/vine'

export const createTenantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    slug: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(255)
      .regex(/^[a-z0-9-]+$/),
  })
)
