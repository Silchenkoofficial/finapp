import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { LoanTracker } from '../components/LoanTracker'
import { LoanSkeleton } from '../components/skeletons/LoanSkeleton'

export const Route = createFileRoute('/')({
  component: LoanPage,
})

function LoanPage() {
  const { config, isLoading, updateLoan } = useConfig()
  if (isLoading || !config) return <LoanSkeleton />
  return <LoanTracker config={config} onUpdateLoan={updateLoan} />
}
