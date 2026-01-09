import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../../components/ui/page-header'
import { ProductsList } from '../../components/features/products/products-list'

export const Route = createFileRoute('/dashboard/products')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <div>
      <PageHeader
        heading="Products"
        description="Manage your product inventory"
      />
      <ProductsList />
    </div>
  )
}
