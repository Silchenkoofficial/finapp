import { Skeleton } from '../ui/skeleton'

export function OverviewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Hero card */}
      <div className="bg-[#111827] rounded-2xl p-5 space-y-4">
        <Skeleton className="h-3 w-24 bg-white/10" />
        <Skeleton className="h-9 w-40 bg-white/10" />
        <Skeleton className="h-4 w-32 bg-white/10" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className="h-14 bg-white/10" />
          ))}
        </div>
      </div>

      {/* Loan progress */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Two period cards */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Pots */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-1 mt-1">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-7 w-7 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
