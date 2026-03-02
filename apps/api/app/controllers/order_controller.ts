import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SaleService from '#services/sale_service'
import { createOrderValidator, processPaymentValidator } from '#validators/sale'

export default class OrderController {
  @inject()
  async index({ params, request, response }: HttpContext, saleService: SaleService) {
    const tenantId = Number(params.tenant_id)
    const page = request.input('page')
    const perPage = request.input('perPage')

    const orders = await saleService.listOrders(tenantId, {
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    })
    return response.json(orders)
  }

  @inject()
  async show({ params, response }: HttpContext, saleService: SaleService) {
    const tenantId = Number(params.tenant_id)
    const orderId = Number(params.id)
    const order = await saleService.getOrder(tenantId, orderId)
    return response.json(order)
  }

  @inject()
  async store({ params, request, auth, response }: HttpContext, saleService: SaleService) {
    const tenantId = Number(params.tenant_id)
    const user = auth.user!
    const payload = await request.validateUsing(createOrderValidator)

    const order = await saleService.createOrder(tenantId, user.id, payload)
    return response.created(order)
  }

  @inject()
  async pay({ params, request, response }: HttpContext, saleService: SaleService) {
    const tenantId = Number(params.tenant_id)
    const orderId = Number(params.id)
    const payload = await request.validateUsing(processPaymentValidator)

    const payment = await saleService.processPayment(tenantId, orderId, payload)
    return response.json(payment)
  }
}
