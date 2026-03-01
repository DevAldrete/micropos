import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Auth / register', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('creates a user and returns 201 with user data', async ({ client }) => {
    const response = await client.post('/auth/register').json({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
      password_confirmation: 'secret1234',
    })

    response.assertStatus(201)
    response.assertBodyContains({ email: 'jane@example.com', fullName: 'Jane Doe' })
    response.assertBodyNotContains({ password: 'secret1234' })
  })

  test('returns 422 when email is already taken', async ({ client }) => {
    await User.create({
      fullName: 'Existing User',
      email: 'jane@example.com',
      password: 'secret1234',
    })

    const response = await client.post('/auth/register').json({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
      password_confirmation: 'secret1234',
    })

    response.assertStatus(422)
  })

  test('returns 422 when password confirmation does not match', async ({ client }) => {
    const response = await client.post('/auth/register').json({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret1234',
      password_confirmation: 'different',
    })

    response.assertStatus(422)
  })

  test('returns 422 when required fields are missing', async ({ client }) => {
    const response = await client.post('/auth/register').json({})

    response.assertStatus(422)
  })
})
