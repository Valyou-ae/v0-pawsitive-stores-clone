import { SparklesIcon } from "@/components/icon-components"
import { Card } from "@/components/ui/card"

interface ComingSoonProps {
  feature: string
  description: string
}

export function ComingSoon({ feature, description }: ComingSoonProps) {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <SparklesIcon className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-text">{feature}</h2>
          <p className="text-muted text-lg">{description}</p>
        </div>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium text-primary">Coming Soon</span>
        </div>
      </div>
    </Card>
  )
}
