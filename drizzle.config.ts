import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema/*',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ultimate_pos',
  },
} satisfies Config
