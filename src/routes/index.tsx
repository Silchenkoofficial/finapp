import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Overview } from '../components/Overview'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { config, isLoading } = useConfig()
  if (isLoading || !config) return <LoadingSpinner />
  return <Overview config={config} />
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
    </div>
  )
}
