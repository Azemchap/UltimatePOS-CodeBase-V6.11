import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../../stores/auth-store'
import { Button } from '../../ui/button'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Products', href: '/dashboard/products', icon: '📦' },
    { label: 'Sales', href: '/dashboard/sales', icon: '💰' },
    { label: 'Purchases', href: '/dashboard/purchases', icon: '🛒' },
    { label: 'Inventory', href: '/dashboard/inventory', icon: '📋' },
    { label: 'Customers', href: '/dashboard/customers', icon: '👥' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-6 px-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ultimate POS</h2>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  activeProps={{
                    className: 'bg-primary text-primary-foreground hover:bg-primary/90',
                  }}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 dark:text-gray-400"
            >
              {isSidebarOpen ? '☰' : '☰'}
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {user?.firstName || 'User'}
              </span>
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-57px)]">{children}</main>
      </div>
    </div>
  )
}
