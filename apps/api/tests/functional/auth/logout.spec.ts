import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Auth / logout + me', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('GET /auth/me returns the authenticated user', async ({ client }) => {
    const user = await User.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
    })

    const response = await client.get('/auth/me').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ email: 'jane@example.com' })
  })

  test('GET /auth/me returns 401 when unauthenticated', async ({ client }) => {
    const response = await client.get('/auth/me')

    response.assertStatus(401)
  })

  test('POST /auth/logout returns 200 when authenticated', async ({ client }) => {
    const user = await User.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
    })

    const response = await client.post('/auth/logout').loginAs(user)

    response.assertStatus(200)
  })

  test('POST /auth/logout returns 401 when unauthenticated', async ({ client }) => {
    const response = await client.post('/auth/logout')

    response.assertStatus(401)
  })
})
