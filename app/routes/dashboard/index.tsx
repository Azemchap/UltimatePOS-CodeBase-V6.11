import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../../components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  const stats = [
    { title: 'Total Sales', value: '$0.00', icon: '💰', change: '+0%' },
    { title: 'Total Purchases', value: '$0.00', icon: '🛒', change: '+0%' },
    { title: 'Products', value: '0', icon: '📦', change: '+0%' },
    { title: 'Customers', value: '0', icon: '👥', change: '+0%' },
  ]

  return (
    <div>
      <PageHeader
        heading="Dashboard"
        description="Overview of your business metrics"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
