import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Auth / login', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('returns 200 and user data with valid credentials', async ({ client }) => {
    await User.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
    })

    const response = await client.post('/auth/login').json({
      email: 'jane@example.com',
      password: 'secret1234',
    })

    response.assertStatus(200)
    response.assertBodyContains({ email: 'jane@example.com' })
    response.assertBodyNotContains({ password: 'secret1234' })
  })

  test('returns 400 with invalid credentials', async ({ client }) => {
    await User.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
    })

    const response = await client.post('/auth/login').json({
      email: 'jane@example.com',
      password: 'wrongpassword',
    })

    response.assertStatus(400)
  })

  test('returns 422 when fields are missing', async ({ client }) => {
    const response = await client.post('/auth/login').json({})

    response.assertStatus(422)
  })
})
