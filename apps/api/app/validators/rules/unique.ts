import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options for the unique rule
 */
type Options = {
  table: string
  column: string
}

/**
 * Implementation of the unique rule
 */
async function unique(value: unknown, options: Options, field: FieldContext) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  const row = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (row) {
    field.report('The {{ field }} has already been taken', 'unique', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const uniqueRule = vine.createRule(unique)
