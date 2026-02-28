import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    customerId: vine.number().positive().optional(),
    items: vine
      .array(
        vine.object({
          productId: vine.number().positive(),
          quantity: vine.number().min(1),
        })
      )
      .minLength(1),
  })
)

export const processPaymentValidator = vine.compile(
  vine.object({
    amount: vine.number().positive(),
    method: vine.enum(['cash', 'card', 'transfer']),
  })
)
