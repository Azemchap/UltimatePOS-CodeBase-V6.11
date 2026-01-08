import { createFileRoute } from '@tanstack/react-router'
import { ProductsList } from '../../components/features/products/products-list'

export const Route = createFileRoute('/dashboard/products')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your product inventory
        </p>
      </div>
      <ProductsList />
    </div>
  )
}
