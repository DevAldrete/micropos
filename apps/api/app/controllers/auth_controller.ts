import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth_validator'

export default class AuthController {
  /**
   * POST /auth/register
   * Creates a new user account and starts an authenticated session.
   */
  async register({ request, auth, response }: HttpContext): Promise<void> {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

    await auth.use('web').login(user)

    response.status(201)
    response.send({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    })
  }

  /**
   * POST /auth/login
   * Verifies credentials and starts an authenticated session.
   */
  async login({ request, auth, response }: HttpContext): Promise<void> {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    response.status(200)
    response.send({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    })
  }

  /**
   * POST /auth/logout
   * Destroys the current session. Requires authentication.
   */
  async logout({ auth, response }: HttpContext): Promise<void> {
    await auth.use('web').logout()
    response.status(200)
    response.send({ message: 'Logged out successfully' })
  }

  /**
   * GET /auth/me
   * Returns the currently authenticated user. Requires authentication.
   */
  async me({ auth, response }: HttpContext): Promise<void> {
    const user = auth.use('web').user!
    response.status(200)
    response.send({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    })
  }
}
