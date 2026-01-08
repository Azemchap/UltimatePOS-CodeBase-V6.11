import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  const stats = [
    { title: 'Total Sales', value: '$0.00', icon: '💰' },
    { title: 'Total Purchases', value: '$0.00', icon: '🛒' },
    { title: 'Products', value: '0', icon: '📦' },
    { title: 'Customers', value: '0', icon: '👥' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
