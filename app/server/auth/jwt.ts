import { SignJWT, jwtVerify } from 'jose'
import type { User } from '@db/schema'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
)

export interface JWTPayload {
  userId: number
  username: string
  email?: string
}

export async function signToken(user: User): Promise<string> {
  return new SignJWT({
    userId: user.id,
    username: user.username,
    email: user.email,
  } as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}
