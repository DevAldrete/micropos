import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenant_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('tenant_id')
        .unsigned()
        .references('tenants.id')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table.string('role', 50).notNullable().defaultTo('employee') // 'owner', 'admin', 'employee'

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.unique(['tenant_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
