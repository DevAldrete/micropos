import factory from '@adonisjs/lucid/factories'
import Customer from '#models/customer'
import { TenantFactory } from '#database/factories/tenant_factory'

export const CustomerFactory = factory
  .define(Customer, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    }
  })
  .relation('tenant', () => TenantFactory)
  .build()
