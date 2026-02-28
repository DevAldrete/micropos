import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE').notNullable()

      table.decimal('amount', 12, 2).notNullable()
      table.string('method', 50).notNullable() // 'cash', 'card', 'transfer'
      table.string('status', 50).notNullable().defaultTo('completed') // 'pending', 'completed', 'failed'

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
