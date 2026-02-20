import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Auth / logout + me', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('GET /auth/me returns the authenticated user', async ({ client }) => {
    await User.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
    })

    // Establish a session by logging in first
    const loginResponse = await client.post('/auth/login').json({
      email: 'jane@example.com',
      password: 'secret1234',
    })
    loginResponse.assertStatus(200)

    const sessionCookie = loginResponse.cookie('adonis-session')
    const response = await client.get('/auth/me').withCookie('adonis-session', sessionCookie!.value)

    response.assertStatus(200)
    response.assertBodyContains({ email: 'jane@example.com' })
  })

  test('GET /auth/me returns 401 when unauthenticated', async ({ client }) => {
    const response = await client.get('/auth/me')

    response.assertStatus(401)
  })

  test('POST /auth/logout returns 200 when authenticated', async ({ client }) => {
    await User.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
    })

    const loginResponse = await client.post('/auth/login').json({
      email: 'jane@example.com',
      password: 'secret1234',
    })
    loginResponse.assertStatus(200)

    const sessionCookie = loginResponse.cookie('adonis-session')
    const response = await client
      .post('/auth/logout')
      .withCookie('adonis-session', sessionCookie!.value)

    response.assertStatus(200)
  })

  test('POST /auth/logout returns 401 when unauthenticated', async ({ client }) => {
    const response = await client.post('/auth/logout')

    response.assertStatus(401)
  })
})
