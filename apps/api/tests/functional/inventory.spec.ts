import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { TenantFactory } from '#database/factories/tenant_factory'
import { CategoryFactory } from '#database/factories/category_factory'
import { ProductFactory } from '#database/factories/product_factory'

test.group('Inventory API', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('user can fetch categories for a tenant', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const tenant = await TenantFactory.create()
    await tenant.related('members').create({ userId: user.id, role: 'owner' })

    const category = await CategoryFactory.merge({ tenantId: tenant.id }).create()

    const response = await client.get(`/api/v1/t/${tenant.id}/categories`).loginAs(user)

    response.assertStatus(200)
    assert.lengthOf(response.body(), 1)
    assert.equal(response.body()[0].id, category.id)
  })

  test('user can create a category', async ({ client }) => {
    const user = await UserFactory.create()
    const tenant = await TenantFactory.create()
    await tenant.related('members').create({ userId: user.id, role: 'owner' })

    const response = await client.post(`/api/v1/t/${tenant.id}/categories`).loginAs(user).json({
      name: 'Electronics',
      description: 'Gadgets and devices',
    })

    response.assertStatus(201)
    response.assertBodyContains({ name: 'Electronics', description: 'Gadgets and devices' })
  })

  test('user can fetch products', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const tenant = await TenantFactory.create()
    await tenant.related('members').create({ userId: user.id, role: 'owner' })

    const product = await ProductFactory.merge({ tenantId: tenant.id }).create()

    const response = await client.get(`/api/v1/t/${tenant.id}/products`).loginAs(user)

    response.assertStatus(200)
    assert.lengthOf(response.body(), 1)
    assert.equal(response.body()[0].id, product.id)
  })

  test('user can create a product', async ({ client }) => {
    const user = await UserFactory.create()
    const tenant = await TenantFactory.create()
    await tenant.related('members').create({ userId: user.id, role: 'owner' })

    const response = await client.post(`/api/v1/t/${tenant.id}/products`).loginAs(user).json({
      name: 'Laptop',
      price: 1200.5,
      stock: 50,
    })

    response.assertStatus(201)
    response.assertBodyContains({ name: 'Laptop', price: 1200.5, stock: 50 })
  })
})
