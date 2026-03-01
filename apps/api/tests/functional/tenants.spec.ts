import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { TenantFactory } from '#database/factories/tenant_factory'

test.group('Tenants API', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('user can create a tenant and becomes owner', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client.post('/api/v1/tenants').loginAs(user).json({
      name: 'My Store',
      slug: 'my-store',
    })

    response.assertStatus(201)
    response.assertBodyContains({ name: 'My Store', slug: 'my-store' })

    const tenantId = response.body().id

    // Check if the user is owner
    await user.load('memberships')
    assert.lengthOf(user.memberships, 1)
    assert.equal(user.memberships[0].tenantId, tenantId)
    assert.equal(user.memberships[0].role, 'owner')
  })

  test('user can fetch their tenants', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const otherUser = await UserFactory.create()

    const myTenant = await TenantFactory.create()
    await myTenant.related('members').create({ userId: user.id, role: 'owner' })

    const otherTenant = await TenantFactory.create()
    await otherTenant.related('members').create({ userId: otherUser.id, role: 'owner' })

    const response = await client.get('/api/v1/tenants').loginAs(user)

    response.assertStatus(200)
    assert.lengthOf(response.body(), 1)
    assert.equal(response.body()[0].id, myTenant.id)
  })

  test('creating tenant fails with invalid slug', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.post('/api/v1/tenants').loginAs(user).json({
      name: 'My Store',
      slug: 'INVALID SLUG',
    })

    response.assertStatus(422)
  })
})
