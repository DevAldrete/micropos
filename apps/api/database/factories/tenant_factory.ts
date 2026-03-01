import factory from '@adonisjs/lucid/factories'
import Tenant from '#models/tenant'

export const TenantFactory = factory
  .define(Tenant, async ({ faker }) => {
    return {
      name: faker.company.name(),
      slug: faker.string.alphanumeric(10),
    }
  })
  .build()
