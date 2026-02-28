import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Payment from '#models/payment'
import Product from '#models/product'

interface OrderItemPayload {
  productId: number
  quantity: number
}

interface CreateOrderPayload {
  customerId?: number | null
  items: OrderItemPayload[]
}

interface ProcessPaymentPayload {
  amount: number
  method: string // 'cash', 'card', 'transfer'
}

export default class SaleService {
  /**
   * Creates a new order, calculates total, saves items, and reduces inventory stock.
   */
  async createOrder(tenantId: number, userId: number, payload: CreateOrderPayload): Promise<Order> {
    const trx = await db.transaction()

    try {
      // 1. Create the base order
      const order = await Order.create(
        {
          tenantId,
          userId,
          customerId: payload.customerId,
          status: 'pending',
          total: 0, // Will be calculated next
        },
        { client: trx }
      )

      let total = 0

      // 2. Add items and decrement stock
      for (const item of payload.items) {
        // Find product with row lock to prevent race conditions during checkout
        const product = await Product.query({ client: trx })
          .where('tenantId', tenantId)
          .where('id', item.productId)
          .forUpdate()
          .firstOrFail()

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`)
        }

        // Create order item
        await OrderItem.create(
          {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price, // Lock in the historical price
          },
          { client: trx }
        )

        // Decrement stock
        product.stock -= item.quantity
        await product.save()

        // Add to total
        total += Number(product.price) * item.quantity
      }

      // 3. Update order total
      order.total = total
      await order.save()

      await trx.commit()
      return order
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Process a payment for an order.
   * If fully paid, sets order status to completed.
   */
  async processPayment(
    tenantId: number,
    orderId: number,
    payload: ProcessPaymentPayload
  ): Promise<Payment> {
    const trx = await db.transaction()

    try {
      const order = await Order.query({ client: trx })
        .where('tenantId', tenantId)
        .where('id', orderId)
        .preload('payments')
        .forUpdate()
        .firstOrFail()

      if (order.status === 'completed') {
        throw new Error('Order is already fully paid')
      }

      const payment = await Payment.create(
        {
          orderId: order.id,
          amount: payload.amount,
          method: payload.method,
          status: 'completed',
        },
        { client: trx }
      )

      // Check if order is fully paid now
      const existingPaymentsTotal =
        order.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
      const newTotalPaid = existingPaymentsTotal + Number(payload.amount)

      if (newTotalPaid >= Number(order.total)) {
        order.status = 'completed'
        await order.save()
      }

      await trx.commit()
      return payment
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Get an order with all its items and payments
   */
  async getOrder(tenantId: number, orderId: number): Promise<Order> {
    return await Order.query()
      .where('tenantId', tenantId)
      .where('id', orderId)
      .preload('items', (itemsQuery) => {
        itemsQuery.preload('product')
      })
      .preload('payments')
      .preload('customer')
      .firstOrFail()
  }

  /**
   * List recent orders for a tenant
   */
  async listOrders(tenantId: number): Promise<Order[]> {
    return await Order.query()
      .where('tenantId', tenantId)
      .preload('customer')
      .orderBy('createdAt', 'desc')
  }
}
