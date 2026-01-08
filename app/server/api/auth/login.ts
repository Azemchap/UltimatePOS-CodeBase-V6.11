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
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password)

      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Check if user is active
      if (!user.isActive) {
        return new Response(JSON.stringify({ error: 'Account is inactive' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Generate JWT token
      const token = await signToken(user)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return new Response(JSON.stringify({
        user: userWithoutPassword,
        token,
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({ error: 'Invalid request data', details: error.format() }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      console.error('Login error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  },
})
