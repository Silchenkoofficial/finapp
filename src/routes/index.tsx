import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Overview } from '../components/Overview'
import { Skeleton } from '../components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: OverviewPage,
})

function OverviewPage() {
  const { config, isLoading } = useConfig()
  if (isLoading || !config) return <OverviewSkeleton />
  return <Overview config={config} />
}

function OverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    </div>
  )
}
