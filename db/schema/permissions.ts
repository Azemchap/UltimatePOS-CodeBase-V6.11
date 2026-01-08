import { pgTable, serial, varchar, timestamp, integer, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  guardName: varchar('guard_name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  guardName: varchar('guard_name', { length: 255 }).notNull(),
  businessId: integer('business_id'),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const roleHasPermissions = pgTable('role_has_permissions', {
  permissionId: integer('permission_id')
    .notNull()
    .references(() => permissions.id, { onDelete: 'cascade' }),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
})

export const modelHasRoles = pgTable('model_has_roles', {
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  modelType: varchar('model_type', { length: 255 }).notNull(),
  modelId: integer('model_id').notNull(),
})

export const modelHasPermissions = pgTable('model_has_permissions', {
  permissionId: integer('permission_id')
    .notNull()
    .references(() => permissions.id, { onDelete: 'cascade' }),
  modelType: varchar('model_type', { length: 255 }).notNull(),
  modelId: integer('model_id').notNull(),
})

export const insertPermissionSchema = createInsertSchema(permissions)
export const selectPermissionSchema = createSelectSchema(permissions)
export const insertRoleSchema = createInsertSchema(roles)
export const selectRoleSchema = createSelectSchema(roles)

export type Permission = typeof permissions.$inferSelect
export type Role = typeof roles.$inferSelect
