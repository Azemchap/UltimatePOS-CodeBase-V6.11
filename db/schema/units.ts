import { pgTable, serial, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { businesses } from './business'

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id, { onDelete: 'cascade' }),
  actualName: varchar('actual_name', { length: 255 }).notNull(),
  shortName: varchar('short_name', { length: 10 }).notNull(),
  allowDecimal: boolean('allow_decimal').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const unitsRelations = relations(units, ({ one }) => ({
  business: one(businesses, {
    fields: [units.businessId],
    references: [businesses.id],
  }),
}))

export const insertUnitSchema = createInsertSchema(units)
export const selectUnitSchema = createSelectSchema(units)

export type Unit = typeof units.$inferSelect
export type NewUnit = typeof units.$inferInsert
