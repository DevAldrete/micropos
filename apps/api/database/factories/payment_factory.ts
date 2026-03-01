import factory from '@adonisjs/lucid/factories'
import Payment from '#models/payment'
import { OrderFactory } from '#database/factories/order_factory'

export const PaymentFactory = factory
  .define(Payment, async () => {
    return {
      amount: 100,
      method: 'cash',
      status: 'completed',
    }
  })
  .relation('order', () => OrderFactory)
  .build()
