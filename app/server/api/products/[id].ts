import { json } from '@tanstack/start'
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
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      await verifyToken(authHeader.substring(7))

      const id = parseInt(params.id)
      const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1)

      if (!product) {
        return json({ error: 'Product not found' }, { status: 404 })
      }

      return json({ data: product })
    } catch (error) {
      console.error('Get product error:', error)
      return json({ error: 'Internal server error' }, { status: 500 })
    }
  },

  PUT: async ({ request, params }) => {
    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return json({ error: 'Unauthorized' }, { status: 401 })
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
        return json({ error: 'Product not found' }, { status: 404 })
      }

      return json({ data: updatedProduct })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
      }

      console.error('Update product error:', error)
      return json({ error: 'Internal server error' }, { status: 500 })
    }
  },

  DELETE: async ({ request, params }) => {
    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      await verifyToken(authHeader.substring(7))

      const id = parseInt(params.id)
      const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning()

      if (!deletedProduct) {
        return json({ error: 'Product not found' }, { status: 404 })
      }

      return json({ data: deletedProduct })
    } catch (error) {
      console.error('Delete product error:', error)
      return json({ error: 'Internal server error' }, { status: 500 })
    }
  },
})
