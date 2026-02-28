import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE').notNullable()
      table
        .integer('product_id')
        .unsigned()
        .references('products.id')
        .onDelete('SET NULL')
        .nullable()

      table.integer('quantity').notNullable().defaultTo(1)
      table.decimal('price', 12, 2).notNullable() // Historical price at the time of order

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
