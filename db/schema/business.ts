import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  date,
  decimal,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { currencies } from './currencies'

export const accountingMethodEnum = pgEnum('accounting_method', ['fifo', 'lifo', 'avco'])
export const sellPriceTaxEnum = pgEnum('sell_price_tax', ['includes', 'excludes'])

export const businesses = pgTable('businesses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  currencyId: integer('currency_id')
    .notNull()
    .references(() => currencies.id),
  startDate: date('start_date'),
  taxNumber1: varchar('tax_number_1', { length: 100 }).notNull(),
  taxLabel1: varchar('tax_label_1', { length: 10 }).notNull(),
  taxNumber2: varchar('tax_number_2', { length: 100 }),
  taxLabel2: varchar('tax_label_2', { length: 10 }),
  defaultProfitPercent: decimal('default_profit_percent', { precision: 5, scale: 2 })
    .notNull()
    .default('0'),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  timeZone: varchar('time_zone', { length: 100 }).notNull().default('UTC'),
  fyStartMonth: integer('fy_start_month').notNull().default(1),
  accountingMethod: accountingMethodEnum('accounting_method').notNull().default('fifo'),
  defaultSalesDiscount: decimal('default_sales_discount', { precision: 5, scale: 2 }),
  sellPriceTax: sellPriceTaxEnum('sell_price_tax').notNull().default('includes'),
  logo: varchar('logo', { length: 255 }),
  skuPrefix: varchar('sku_prefix', { length: 50 }),
  enableTooltip: boolean('enable_tooltip').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const businessesRelations = relations(businesses, ({ one }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  currency: one(currencies, {
    fields: [businesses.currencyId],
    references: [currencies.id],
  }),
}))

export const insertBusinessSchema = createInsertSchema(businesses)
export const selectBusinessSchema = createSelectSchema(businesses)

export type Business = typeof businesses.$inferSelect
export type NewBusiness = typeof businesses.$inferInsert
