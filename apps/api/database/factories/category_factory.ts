import factory from '@adonisjs/lucid/factories'
import Category from '#models/category'
import { TenantFactory } from '#database/factories/tenant_factory'

export const CategoryFactory = factory
  .define(Category, async ({ faker }) => {
    return {
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
    }
  })
  .relation('tenant', () => TenantFactory)
  .build()
