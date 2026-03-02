import db from '@adonisjs/lucid/services/db'
import Tenant from '#models/tenant'
import TenantMember from '#models/tenant_member'
import User from '#models/user'

interface CreateTenantPayload {
  name: string
  slug: string
}

interface TenantWithRole {
  id: number
  name: string
  slug: string
  role: string
  createdAt: string
  updatedAt: string | null
}

export default class TenantService {
  /**
   * Creates a new tenant and assigns the user as the owner.
   * Runs inside a transaction to ensure both records are created or neither.
   */
  async createTenant(user: User, payload: CreateTenantPayload): Promise<Tenant> {
    const trx = await db.transaction()

    try {
      const tenant = await Tenant.create(payload, { client: trx })

      await TenantMember.create(
        {
          tenantId: tenant.id,
          userId: user.id,
          role: 'owner',
        },
        { client: trx }
      )

      await trx.commit()
      return tenant
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Adds a new member to an existing tenant
   */
  async addMember(
    tenantId: number,
    userId: number,
    role: 'admin' | 'employee' = 'employee'
  ): Promise<TenantMember> {
    return await TenantMember.create({
      tenantId,
      userId,
      role,
    })
  }

  /**
   * Gets all tenants a user belongs to, including the user's role in each
   */
  async getUserTenants(userId: number): Promise<TenantWithRole[]> {
    const memberships = await TenantMember.query().where('userId', userId).preload('tenant')

    return memberships.map((m) => ({
      ...m.tenant.serialize(),
      role: m.role,
    })) as TenantWithRole[]
  }
}
