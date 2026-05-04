import { Skeleton } from '../ui/skeleton'

export function LoanSkeleton() {
  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="bg-[#111827] rounded-2xl p-5 space-y-3">
        <Skeleton className="h-3 w-24 bg-white/10" />
        <Skeleton className="h-10 w-44 bg-white/10" />
        <Skeleton className="h-3 w-32 bg-white/10" />
        <Skeleton className="h-2.5 w-full bg-white/10" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-28 bg-white/10" />
          <Skeleton className="h-3 w-8 bg-white/10" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        ))}
      </div>

      {/* Payment breakdown */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center px-4 py-3.5 border-b border-stone-100 gap-3">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-4 w-20 shrink-0" />
          </div>
        ))}
      </div>

      <Skeleton className="h-20 w-full" />
    </div>
  )
}
