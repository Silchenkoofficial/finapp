import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { LoanTracker } from '../components/LoanTracker'

export const Route = createFileRoute('/loan')({
  component: LoanPage,
})

function LoanPage() {
  const { config, isLoading, updateLoan } = useConfig()
  if (isLoading || !config) return null
  return <LoanTracker config={config} onUpdateLoan={updateLoan} />
}
