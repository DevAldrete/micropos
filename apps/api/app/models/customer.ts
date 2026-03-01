import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'
import Order from '#models/order'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tenantId: number

  @column()
  declare name: string

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>
}
