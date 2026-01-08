import { pgTable, serial, varchar, timestamp, integer, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { businesses } from './business'
import { users } from './users'

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const brandsRelations = relations(brands, ({ one }) => ({
  business: one(businesses, {
    fields: [brands.businessId],
    references: [businesses.id],
  }),
  creator: one(users, {
    fields: [brands.createdBy],
    references: [users.id],
  }),
}))

export const insertBrandSchema = createInsertSchema(brands)
export const selectBrandSchema = createSelectSchema(brands)

export type Brand = typeof brands.$inferSelect
export type NewBrand = typeof brands.$inferInsert
