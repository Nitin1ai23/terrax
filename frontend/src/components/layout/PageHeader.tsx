import type { ReactNode } from 'react'

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <header className="h-16 shrink-0 border-b border-border px-6 flex items-center justify-between bg-surface/30">
      <div>
        <h1 className="font-display font-semibold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="data-label mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  )
}
