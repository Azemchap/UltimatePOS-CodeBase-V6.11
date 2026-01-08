import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db, users } from '@db'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../auth/password'
import { signToken } from '../../auth/jwt'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const APIRoute = createAPIFileRoute('/api/auth/login')({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const { username, password } = loginSchema.parse(body)

      // Find user by username
      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1)

      if (!user) {
        return json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password)

      if (!isValid) {
        return json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Check if user is active
      if (!user.isActive) {
        return json({ error: 'Account is inactive' }, { status: 403 })
      }

      // Generate JWT token
      const token = await signToken(user)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return json({
        user: userWithoutPassword,
        token,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
      }

      console.error('Login error:', error)
      return json({ error: 'Internal server error' }, { status: 500 })
    }
  },
})
