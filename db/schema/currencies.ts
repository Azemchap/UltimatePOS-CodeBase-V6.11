import { pgTable, serial, varchar, decimal, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const currencies = pgTable('currencies', {
  id: serial('id').primaryKey(),
  country: varchar('country', { length: 255 }).notNull(),
  currency: varchar('currency', { length: 255 }).notNull(),
  code: varchar('code', { length: 10 }).notNull(),
  symbol: varchar('symbol', { length: 10 }).notNull(),
  thousandSeparator: varchar('thousand_separator', { length: 10 }),
  decimalSeparator: varchar('decimal_separator', { length: 10 }),
  exchangeRate: decimal('exchange_rate', { precision: 20, scale: 3 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const insertCurrencySchema = createInsertSchema(currencies)
export const selectCurrencySchema = createSelectSchema(currencies)

export type Currency = typeof currencies.$inferSelect
export type NewCurrency = typeof currencies.$inferInsert
