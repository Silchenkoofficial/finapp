import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Pots } from '../components/Pots'
import { PotsSkeleton } from '../components/skeletons/PotsSkeleton'

export const Route = createFileRoute('/pots')({
  component: PotsPage,
})

function PotsPage() {
  const { config, isLoading } = useConfig()
  if (isLoading || !config) return <PotsSkeleton />
  return <Pots config={config} />
}
