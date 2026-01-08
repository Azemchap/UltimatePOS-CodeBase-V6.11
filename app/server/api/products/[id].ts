
import { createAPIFileRoute } from '@tanstack/start/api'
import { db, products, insertProductSchema } from '@db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { verifyToken } from '../../auth/jwt'

export const APIRoute = createAPIFileRoute('/api/products/$id')({
  GET: async ({ request, params }) => {
    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
      }

      await verifyToken(authHeader.substring(7))

      const id = parseInt(params.id)
      const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1)

      if (!product) {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
      }

      return new Response(JSON.stringify({ data: product }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Get product error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
  },

  PUT: async ({ request, params }) => {
    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
      }

      await verifyToken(authHeader.substring(7))

      const id = parseInt(params.id)
      const body = await request.json()
      const validatedData = insertProductSchema.partial().parse(body)

      const [updatedProduct] = await db
        .update(products)
        .set(validatedData)
        .where(eq(products.id, id))
        .returning()

      if (!updatedProduct) {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
      }

      return new Response(JSON.stringify({ data: updatedProduct }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({ error: 'Invalid request data', details: error.format() }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }

      console.error('Update product error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
  },

  DELETE: async ({ request, params }) => {
    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
      }

      await verifyToken(authHeader.substring(7))

      const id = parseInt(params.id)
      const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning()

      if (!deletedProduct) {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
      }

      return new Response(JSON.stringify({ data: deletedProduct }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Delete product error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
  },
})
