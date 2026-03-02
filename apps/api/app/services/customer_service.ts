import Customer from '#models/customer'
import transmit from '@adonisjs/transmit/services/main'
import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

interface CreateCustomerPayload {
  name: string
  email?: string | null
  phone?: string | null
}

export default class CustomerService {
  /**
   * List customers for a tenant with pagination
   */
  async listCustomers(
    tenantId: number,
    options: { page?: number; perPage?: number; search?: string } = {}
  ): Promise<ModelPaginatorContract<Customer>> {
    const page = options.page ?? 1
    const perPage = options.perPage ?? 20

    const query = Customer.query().where('tenantId', tenantId).orderBy('name', 'asc')

    if (options.search) {
      const term = `%${options.search}%`
      query.where((q) => {
        q.whereILike('name', term).orWhereILike('email', term).orWhereILike('phone', term)
      })
    }

    return await query.paginate(page, perPage)
  }

  /**
   * Get a single customer by ID
   */
  async getCustomer(tenantId: number, customerId: number): Promise<Customer> {
    return await Customer.query().where('tenantId', tenantId).where('id', customerId).firstOrFail()
  }

  /**
   * Create a new customer for a tenant
   */
  async createCustomer(tenantId: number, payload: CreateCustomerPayload): Promise<Customer> {
    const customer = await Customer.create({
      tenantId,
      ...payload,
    })

    transmit.broadcast(`tenants/${tenantId}/customers`, { event: 'customer:created' })
    return customer
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(
    tenantId: number,
    customerId: number,
    payload: Partial<CreateCustomerPayload>
  ): Promise<Customer> {
    const customer = await Customer.query()
      .where('tenantId', tenantId)
      .where('id', customerId)
      .firstOrFail()

    customer.merge(payload)
    await customer.save()

    transmit.broadcast(`tenants/${tenantId}/customers`, { event: 'customer:updated' })
    return customer
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(tenantId: number, customerId: number): Promise<void> {
    const customer = await Customer.query()
      .where('tenantId', tenantId)
      .where('id', customerId)
      .firstOrFail()

    await customer.delete()
    transmit.broadcast(`tenants/${tenantId}/customers`, { event: 'customer:deleted' })
  }
}
