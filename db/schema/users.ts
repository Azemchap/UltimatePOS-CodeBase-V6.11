import { pgTable, serial, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { businesses } from './business'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  surname: varchar('surname', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  language: varchar('language', { length: 7 }).notNull().default('en'),
  rememberToken: varchar('remember_token', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  emailVerifiedAt: timestamp('email_verified_at'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businesses),
}))

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
