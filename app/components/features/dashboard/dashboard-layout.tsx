import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../../stores/auth-store'
import { useThemeStore } from '../../../stores/theme-store'
import { Button } from '../../ui/button'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

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
    <div className="min-h-screen bg-background">
      {/* Sidebar - Solid color background, no blur */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-sidebar border-r border-sidebar-border w-64 lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="px-6 py-5 border-b border-sidebar-border">
            <h2 className="text-2xl font-bold text-sidebar-foreground">Ultimate POS</h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group"
                    activeProps={{
                      className: 'bg-primary text-primary-foreground hover:bg-primary/90',
                    }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span className="font-medium">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 transition-all">
        {/* Header - Solid color background, no blur */}
        <header className="sticky top-0 z-20 bg-card border-b border-border">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
              size="icon"
            >
              <span className="text-xl">☰</span>
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, <span className="text-foreground font-medium">{user?.firstName || 'User'}</span>
              </span>
              <Button variant="ghost" onClick={toggleTheme} size="icon" className="hidden lg:flex">
                <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
              </Button>
              <Button variant="outline" onClick={logout} size="sm">
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-57px)] p-6">{children}</main>
      </div>
    </div>
  )
}
