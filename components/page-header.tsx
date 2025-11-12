import type React from "react"

interface PageHeaderProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  actions?: React.ReactNode
}

export function PageHeader({ icon, title, description, gradient, actions }: PageHeaderProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`bg-gradient-to-br ${gradient} p-3 rounded-xl`}>{icon}</div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-400 text-lg">{description}</p>
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}
