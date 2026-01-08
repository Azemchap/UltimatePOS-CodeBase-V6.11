import { createFileRoute } from '@tanstack/react-router'
import { ProductsList } from '../../components/features/products/products-list'

export const Route = createFileRoute('/dashboard/products')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground mt-1">
          Manage your product inventory
        </p>
      </div>
      <ProductsList />
    </div>
  )
}
