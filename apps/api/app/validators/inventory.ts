import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().maxLength(500).optional().nullable(),
  })
)

export const updateCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    description: vine.string().trim().maxLength(500).optional().nullable(),
  })
)

export const createProductValidator = vine.compile(
  vine.object({
    categoryId: vine.number().positive().optional().nullable(),
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().maxLength(500).optional().nullable(),
    price: vine.number().positive(),
    stock: vine.number().min(0),
    sku: vine.string().trim().maxLength(100).optional().nullable(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    categoryId: vine.number().positive().optional().nullable(),
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    description: vine.string().trim().maxLength(500).optional().nullable(),
    price: vine.number().positive().optional(),
    stock: vine.number().min(0).optional(),
    sku: vine.string().trim().maxLength(100).optional().nullable(),
  })
)
