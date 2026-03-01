import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('tenant_id')
        .unsigned()
        .references('tenants.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('category_id')
        .unsigned()
        .references('categories.id')
        .onDelete('SET NULL')
        .nullable()

      table.string('name', 255).notNullable()
      table.string('description', 500).nullable()
      table.decimal('price', 12, 2).notNullable()
      table.integer('stock').notNullable().defaultTo(0)
      table.string('sku', 100).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.unique(['tenant_id', 'sku'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
