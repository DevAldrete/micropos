import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CustomerService from '#services/customer_service'
import { createCustomerValidator, updateCustomerValidator } from '#validators/customer'

export default class CustomerController {
  @inject()
  async index({ params, request, response }: HttpContext, customerService: CustomerService) {
    const tenantId = Number(params.tenant_id)
    const page = request.input('page')
    const perPage = request.input('perPage')
    const search = request.input('search')

    const customers = await customerService.listCustomers(tenantId, {
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
      search: search || undefined,
    })
    return response.json(customers)
  }

  @inject()
  async show({ params, response }: HttpContext, customerService: CustomerService) {
    const tenantId = Number(params.tenant_id)
    const customerId = Number(params.id)
    const customer = await customerService.getCustomer(tenantId, customerId)
    return response.json(customer)
  }

  @inject()
  async store({ params, request, response }: HttpContext, customerService: CustomerService) {
    const tenantId = Number(params.tenant_id)
    const payload = await request.validateUsing(createCustomerValidator)

    const customer = await customerService.createCustomer(tenantId, payload)
    return response.created(customer)
  }

  @inject()
  async update({ params, request, response }: HttpContext, customerService: CustomerService) {
    const tenantId = Number(params.tenant_id)
    const customerId = Number(params.id)
    const payload = await request.validateUsing(updateCustomerValidator)

    const customer = await customerService.updateCustomer(tenantId, customerId, payload)
    return response.json(customer)
  }

  @inject()
  async destroy({ params, response }: HttpContext, customerService: CustomerService) {
    const tenantId = Number(params.tenant_id)
    const customerId = Number(params.id)

    await customerService.deleteCustomer(tenantId, customerId)
    return response.noContent()
  }
}
