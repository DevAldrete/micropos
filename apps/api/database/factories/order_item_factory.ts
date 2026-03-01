import factory from '@adonisjs/lucid/factories'
import OrderItem from '#models/order_item'
import { OrderFactory } from '#database/factories/order_factory'
import { ProductFactory } from '#database/factories/product_factory'

export const OrderItemFactory = factory
  .define(OrderItem, async () => {
    return {
      quantity: 1,
      price: 100,
    }
  })
  .relation('order', () => OrderFactory)
  .relation('product', () => ProductFactory)
  .build()
