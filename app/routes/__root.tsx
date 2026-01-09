import { createRootRoute, Outlet } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTheme } from '../stores/theme-store'
import '../styles/globals.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  // Initialize theme
  useTheme()

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ultimate POS - Modern Point of Sale System</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
