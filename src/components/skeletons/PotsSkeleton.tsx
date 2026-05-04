import { Skeleton } from '../ui/skeleton'

function PotListSkeleton({ count }: { count: number }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center px-4 py-3.5 border-b border-stone-100 last:border-0 gap-3">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-2.5 w-24" />
          </div>
          <div className="space-y-1.5 items-end flex flex-col shrink-0">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PotsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <PotListSkeleton count={6} />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <PotListSkeleton count={2} />
      </div>

      <Skeleton className="h-36 w-full" />
    </div>
  )
}
