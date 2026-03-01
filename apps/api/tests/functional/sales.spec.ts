import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { TenantFactory } from '#database/factories/tenant_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { OrderFactory } from '#database/factories/order_factory'

test.group('Sales API', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('user can create an order and stock decreases', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const tenant = await TenantFactory.create()
    await tenant.related('members').create({ userId: user.id, role: 'owner' })

    const product = await ProductFactory.merge({
      tenantId: tenant.id,
      price: 100,
      stock: 10,
    }).create()

    const response = await client
      .post(`/api/v1/t/${tenant.id}/orders`)
      .loginAs(user)
      .json({
        items: [{ productId: product.id, quantity: 2 }],
      })

    response.assertStatus(201)
    response.assertBodyContains({ total: 200, status: 'pending' })

    await product.refresh()
    assert.equal(product.stock, 8)
  })

  test('user can process a payment for an order', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const tenant = await TenantFactory.create()
    await tenant.related('members').create({ userId: user.id, role: 'owner' })

    const order = await OrderFactory.merge({
      tenantId: tenant.id,
      userId: user.id,
      total: 200,
      status: 'pending',
    }).create()

    const response = await client
      .post(`/api/v1/t/${tenant.id}/orders/${order.id}/pay`)
      .loginAs(user)
      .json({
        amount: 200,
        method: 'cash',
      })

    response.assertStatus(200)
    response.assertBodyContains({ amount: 200, method: 'cash' })

    await order.refresh()
    assert.equal(order.status, 'completed')
  })
})
