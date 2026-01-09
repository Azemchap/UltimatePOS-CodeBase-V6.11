import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '../components/features/auth/login-form'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Ultimate POS
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
