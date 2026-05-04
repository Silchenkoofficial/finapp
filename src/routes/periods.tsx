import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { PeriodBreakdown } from '../components/PeriodBreakdown'
import { PeriodsSkeleton } from '../components/skeletons/PeriodsSkeleton'

export const Route = createFileRoute('/periods')({
  component: PeriodsPage,
})

function PeriodsPage() {
  const { config, isLoading, updatePeriodIncome, updateEarlyLoan, updateFixedExpense, updateDailyExpense } = useConfig()
  if (isLoading || !config) return <PeriodsSkeleton />
  return (
    <PeriodBreakdown
      config={config}
      onUpdateIncome={updatePeriodIncome}
      onUpdateEarlyLoan={updateEarlyLoan}
      onUpdateFixed={updateFixedExpense}
      onUpdateDaily={updateDailyExpense}
    />
  )
}
