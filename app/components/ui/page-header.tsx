import * as React from 'react'
import { cn } from '../../lib/utils'

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, description, children, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)} {...props}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{heading}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
