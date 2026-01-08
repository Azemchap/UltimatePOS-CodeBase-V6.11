import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/ultimate_pos'

// For query purposes
const queryClient = postgres(connectionString)
export const db = drizzle(queryClient, { schema })

// Export types
export type DB = typeof db
export * from './schema'
