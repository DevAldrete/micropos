import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TeamService from '#services/team_service'
import { inviteMemberValidator, updateRoleValidator } from '#validators/team'

export default class TeamController {
  @inject()
  async index({ params, response }: HttpContext, teamService: TeamService) {
    const tenantId = Number(params.tenant_id)
    const members = await teamService.listMembers(tenantId)
    return response.json(members)
  }

  @inject()
  async invite({ params, request, response }: HttpContext, teamService: TeamService) {
    const tenantId = Number(params.tenant_id)
    const payload = await request.validateUsing(inviteMemberValidator)

    if (payload.password !== payload.password_confirmation) {
      return response.unprocessableEntity({
        message: 'Validation failure',
        errors: [{ field: 'password_confirmation', message: 'Passwords do not match' }],
      })
    }

    try {
      const member = await teamService.inviteMember(tenantId, {
        email: payload.email,
        password: payload.password,
        fullName: payload.fullName,
        role: payload.role,
      })
      return response.created(member)
    } catch (error) {
      if (error instanceof Error && (error as any).status === 422) {
        return response.unprocessableEntity({ message: error.message })
      }
      throw error
    }
  }

  @inject()
  async updateRole({ params, request, response }: HttpContext, teamService: TeamService) {
    const tenantId = Number(params.tenant_id)
    const memberId = Number(params.id)
    const payload = await request.validateUsing(updateRoleValidator)

    try {
      const member = await teamService.updateRole(tenantId, memberId, payload.role)
      return response.json(member)
    } catch (error) {
      if (error instanceof Error && (error as any).status === 422) {
        return response.unprocessableEntity({ message: error.message })
      }
      throw error
    }
  }

  @inject()
  async destroy({ params, auth, response }: HttpContext, teamService: TeamService) {
    const tenantId = Number(params.tenant_id)
    const memberId = Number(params.id)
    const userId = auth.user!.id

    try {
      await teamService.removeMember(tenantId, memberId, userId)
      return response.noContent()
    } catch (error) {
      if (error instanceof Error && (error as any).status === 422) {
        return response.unprocessableEntity({ message: error.message })
      }
      throw error
    }
  }
}
