
import { createAPIFileRoute } from '@tanstack/start/api'
import { db, products, insertProductSchema } from '@db'
import { eq, and, like, desc } from 'drizzle-orm'
import { z } from 'zod'
import { verifyToken } from '../../auth/jwt'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  businessId: z.coerce.number().optional(),
})

export const APIRoute = createAPIFileRoute('/api/products')({
  GET: async ({ request }) => {
    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
      }

      const token = authHeader.substring(7)
      await verifyToken(token)

      // Parse query parameters
      const url = new URL(request.url)
      const params = querySchema.parse({
        page: url.searchParams.get('page'),
        limit: url.searchParams.get('limit'),
        search: url.searchParams.get('search'),
        businessId: url.searchParams.get('businessId'),
      })

      // Build query
      let query = db.select().from(products)

      // Apply filters
      const conditions = []
      if (params.businessId) {
        conditions.push(eq(products.businessId, params.businessId))
      }
      if (params.search) {
        conditions.push(like(products.name, `%${params.search}%`))
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any
      }

      // Apply pagination
      const offset = (params.page - 1) * params.limit
      const items = await query
        .orderBy(desc(products.createdAt))
        .limit(params.limit)
        .offset(offset)

      return new Response(JSON.stringify({
        data: items,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: items.length,
        },
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Get products error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
  },

  POST: async ({ request }) => {
    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
      }

      const token = authHeader.substring(7)
      const payload = await verifyToken(token)

      const body = await request.json()
      const validatedData = insertProductSchema.parse(body)

      // Create product
      const [newProduct] = await db
        .insert(products)
        .values({
          ...validatedData,
          createdBy: payload.userId,
        })
        .returning()

      return new Response(JSON.stringify({ data: newProduct }), { status: 201, headers: { 'Content-Type': 'application/json' } })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({ error: 'Invalid request data', details: error.format() }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }

      console.error('Create product error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
  },
})
