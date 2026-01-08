import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  pgEnum,
  text,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { businesses } from './business'
import { users } from './users'
import { brands } from './brands'
import { categories } from './categories'
import { units } from './units'
import { taxRates } from './tax-rates'

export const productTypeEnum = pgEnum('product_type', ['single', 'variable'])
export const taxTypeEnum = pgEnum('tax_type', ['inclusive', 'exclusive'])
export const barcodeTypeEnum = pgEnum('barcode_type', [
  'C39',
  'C128',
  'EAN-13',
  'EAN-8',
  'UPC-A',
  'UPC-E',
  'ITF-14',
])

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id, { onDelete: 'cascade' }),
  type: productTypeEnum('type').notNull().default('single'),
  unitId: integer('unit_id')
    .notNull()
    .references(() => units.id, { onDelete: 'cascade' }),
  brandId: integer('brand_id').references(() => brands.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  subCategoryId: integer('sub_category_id').references(() => categories.id, {
    onDelete: 'cascade',
  }),
  tax: integer('tax').references(() => taxRates.id),
  taxType: taxTypeEnum('tax_type').notNull().default('inclusive'),
  enableStock: boolean('enable_stock').notNull().default(false),
  alertQuantity: decimal('alert_quantity', { precision: 22, scale: 4 }).notNull().default('0'),
  sku: varchar('sku', { length: 255 }).notNull(),
  barcodeType: barcodeTypeEnum('barcode_type').notNull().default('C128'),
  description: text('description'),
  productImage: varchar('product_image', { length: 255 }),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const productsRelations = relations(products, ({ one }) => ({
  business: one(businesses, {
    fields: [products.businessId],
    references: [businesses.id],
  }),
  unit: one(units, {
    fields: [products.unitId],
    references: [units.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  creator: one(users, {
    fields: [products.createdBy],
    references: [users.id],
  }),
}))

export const insertProductSchema = createInsertSchema(products)
export const selectProductSchema = createSelectSchema(products)

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
