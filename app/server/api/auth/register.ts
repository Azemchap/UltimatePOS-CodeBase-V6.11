import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db, users, insertUserSchema } from '@db'
import { eq } from 'drizzle-orm'
import { hashPassword } from '../../auth/password'
import { signToken } from '../../auth/jwt'
import { z } from 'zod'

const registerSchema = insertUserSchema
  .pick({
    surname: true,
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    language: true,
  })
  .extend({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const APIRoute = createAPIFileRoute('/api/auth/register')({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const validatedData = registerSchema.parse(body)

      // Check if username already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, validatedData.username))
        .limit(1)

      if (existingUser) {
        return json({ error: 'Username already exists' }, { status: 409 })
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password)

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          surname: validatedData.surname,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          username: validatedData.username,
          email: validatedData.email,
          password: hashedPassword,
          language: validatedData.language || 'en',
          isActive: true,
        })
        .returning()

      // Generate JWT token
      const token = await signToken(newUser)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser

      return json({
        user: userWithoutPassword,
        token,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
      }

      console.error('Registration error:', error)
      return json({ error: 'Internal server error' }, { status: 500 })
    }
  },
})
