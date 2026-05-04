import { Skeleton } from '../ui/skeleton'

function PeriodBlockSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
          <Skeleton className="h-3 w-48" />
        </div>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center px-4 py-3 border-b border-stone-100 gap-3">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
            <Skeleton className="h-4 w-16 shrink-0" />
          </div>
        ))}
        <div className="flex items-center px-4 py-3.5 bg-stone-50 border-t border-stone-200 gap-3">
          <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-2.5 w-24" />
          </div>
          <Skeleton className="h-5 w-20 shrink-0" />
        </div>
      </div>
    </div>
  )
}

export function PeriodsSkeleton() {
  return (
    <div className="space-y-6">
      <PeriodBlockSkeleton />
      <PeriodBlockSkeleton />
      <div className="bg-emerald-800/20 rounded-2xl p-5 space-y-3">
        <Skeleton className="h-3 w-40 bg-emerald-800/30" />
        <Skeleton className="h-8 w-32 bg-emerald-800/30" />
        <Skeleton className="h-4 w-56 bg-emerald-800/30" />
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map(i => (
            <Skeleton key={i} className="h-14 bg-emerald-800/30" />
          ))}
        </div>
      </div>
    </div>
  )
}
