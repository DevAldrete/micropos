import db from '@adonisjs/lucid/services/db'
import transmit from '@adonisjs/transmit/services/main'
import TenantMember from '#models/tenant_member'
import User from '#models/user'

interface InviteMemberPayload {
  email: string
  password: string
  fullName: string
  role: 'admin' | 'employee'
}

interface TeamMemberSerialized {
  id: number
  userId: number
  role: string
  createdAt: string
  user: {
    id: number
    fullName: string | null
    email: string
  }
}

export default class TeamService {
  /**
   * List all team members for a tenant, with their user info.
   */
  async listMembers(tenantId: number): Promise<TeamMemberSerialized[]> {
    const members = await TenantMember.query()
      .where('tenantId', tenantId)
      .preload('user')
      .orderBy('createdAt', 'asc')

    return members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      createdAt: m.createdAt.toISO()!,
      user: {
        id: m.user.id,
        fullName: m.user.fullName,
        email: m.user.email,
      },
    }))
  }

  /**
   * Invite a new member to the tenant.
   *
   * If a user with the given email already exists, they are added to the
   * tenant (no new account is created). If the user doesn't exist, a new
   * account is created with the provided credentials.
   *
   * Throws if the user is already a member of this tenant.
   */
  async inviteMember(
    tenantId: number,
    payload: InviteMemberPayload
  ): Promise<TeamMemberSerialized> {
    const trx = await db.transaction()

    try {
      // Check for existing user by email
      let user = await User.query({ client: trx }).where('email', payload.email).first()

      if (user) {
        // If user exists, check they're not already a member of this tenant
        const existingMembership = await TenantMember.query({ client: trx })
          .where('tenantId', tenantId)
          .where('userId', user.id)
          .first()

        if (existingMembership) {
          await trx.rollback()
          const error = new Error('This user is already a member of this store')
          ;(error as any).status = 422
          throw error
        }
      } else {
        // Create a new user account
        user = await User.create(
          {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
          },
          { client: trx }
        )
      }

      const membership = await TenantMember.create(
        {
          tenantId,
          userId: user.id,
          role: payload.role,
        },
        { client: trx }
      )

      await trx.commit()

      // Re-fetch with user preloaded for the response
      const member = await TenantMember.query()
        .where('id', membership.id)
        .preload('user')
        .firstOrFail()

      transmit.broadcast(`tenants/${tenantId}/team`, { event: 'member:invited' })

      return {
        id: member.id,
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt.toISO()!,
        user: {
          id: member.user.id,
          fullName: member.user.fullName,
          email: member.user.email,
        },
      }
    } catch (error) {
      if (trx.isCompleted === false) {
        await trx.rollback()
      }
      throw error
    }
  }

  /**
   * Update a team member's role.
   *
   * Prevents demoting the last owner of a tenant.
   */
  async updateRole(
    tenantId: number,
    memberId: number,
    newRole: string
  ): Promise<TeamMemberSerialized> {
    const member = await TenantMember.query()
      .where('tenantId', tenantId)
      .where('id', memberId)
      .preload('user')
      .firstOrFail()

    // Guard: prevent demoting the last owner
    if (member.role === 'owner' && newRole !== 'owner') {
      const ownerCount = await TenantMember.query()
        .where('tenantId', tenantId)
        .where('role', 'owner')
        .count('* as total')

      const total = Number(ownerCount[0].$extras.total)
      if (total <= 1) {
        const error = new Error('Cannot demote the last owner of this store')
        ;(error as any).status = 422
        throw error
      }
    }

    member.role = newRole
    await member.save()

    transmit.broadcast(`tenants/${tenantId}/team`, { event: 'member:updated' })

    return {
      id: member.id,
      userId: member.userId,
      role: member.role,
      createdAt: member.createdAt.toISO()!,
      user: {
        id: member.user.id,
        fullName: member.user.fullName,
        email: member.user.email,
      },
    }
  }

  /**
   * Remove a member from a tenant.
   *
   * Prevents removing the last owner.
   * Prevents a member from removing themselves (they should leave via a
   * different flow if that's ever needed).
   */
  async removeMember(tenantId: number, memberId: number, requestingUserId: number): Promise<void> {
    const member = await TenantMember.query()
      .where('tenantId', tenantId)
      .where('id', memberId)
      .firstOrFail()

    // Guard: cannot remove yourself
    if (member.userId === requestingUserId) {
      const error = new Error('You cannot remove yourself from the store')
      ;(error as any).status = 422
      throw error
    }

    // Guard: cannot remove the last owner
    if (member.role === 'owner') {
      const ownerCount = await TenantMember.query()
        .where('tenantId', tenantId)
        .where('role', 'owner')
        .count('* as total')

      const total = Number(ownerCount[0].$extras.total)
      if (total <= 1) {
        const error = new Error('Cannot remove the last owner of this store')
        ;(error as any).status = 422
        throw error
      }
    }

    await member.delete()
    transmit.broadcast(`tenants/${tenantId}/team`, { event: 'member:removed' })
  }
}
