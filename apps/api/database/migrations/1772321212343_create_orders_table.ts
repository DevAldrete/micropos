import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('tenant_id')
        .unsigned()
        .references('tenants.id')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('SET NULL').nullable() // Cashier
      table
        .integer('customer_id')
        .unsigned()
        .references('customers.id')
        .onDelete('SET NULL')
        .nullable()

      table.string('status', 50).notNullable().defaultTo('pending') // 'pending', 'completed', 'cancelled'
      table.decimal('total', 12, 2).notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
