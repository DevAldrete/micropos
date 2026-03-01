import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'
import { TenantFactory } from '#database/factories/tenant_factory'
import { CategoryFactory } from '#database/factories/category_factory'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price({ min: 10, max: 1000 })),
      stock: faker.number.int({ min: 0, max: 100 }),
      sku: faker.string.alphanumeric(8).toUpperCase(),
    }
  })
  .relation('tenant', () => TenantFactory)
  .relation('category', () => CategoryFactory)
  .build()
