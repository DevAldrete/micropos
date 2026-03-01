import factory from '@adonisjs/lucid/factories'
import Order from '#models/order'
import { TenantFactory } from '#database/factories/tenant_factory'
import { UserFactory } from '#database/factories/user_factory'

export const OrderFactory = factory
  .define(Order, async () => {
    return {
      status: 'pending',
      total: 0,
    }
  })
  .relation('tenant', () => TenantFactory)
  .relation('user', () => UserFactory)
  .build()
