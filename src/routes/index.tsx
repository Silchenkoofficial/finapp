import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Overview } from '../components/Overview'
import { OverviewSkeleton } from '../components/skeletons/OverviewSkeleton'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { config, isLoading } = useConfig()
  if (isLoading || !config) return <OverviewSkeleton />
  return <Overview config={config} />
}
