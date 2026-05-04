import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Pots } from '../components/Pots'

export const Route = createFileRoute('/pots')({
  component: PotsPage,
})

function PotsPage() {
  const { config, isLoading } = useConfig()
  if (isLoading || !config) return null
  return <Pots config={config} />
}
