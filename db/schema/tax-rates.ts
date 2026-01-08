import { pgTable, serial, varchar, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { businesses } from './business'

export const taxRates = pgTable('tax_rates', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 5, scale: 2 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const taxRatesRelations = relations(taxRates, ({ one }) => ({
  business: one(businesses, {
    fields: [taxRates.businessId],
    references: [businesses.id],
  }),
}))

export const insertTaxRateSchema = createInsertSchema(taxRates)
export const selectTaxRateSchema = createSelectSchema(taxRates)

export type TaxRate = typeof taxRates.$inferSelect
export type NewTaxRate = typeof taxRates.$inferInsert
