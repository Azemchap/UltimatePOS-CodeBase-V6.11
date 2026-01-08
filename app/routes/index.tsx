import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    // Check if user is authenticated
    // For now, redirect to login
    throw redirect({
      to: '/login',
    })
  },
})
