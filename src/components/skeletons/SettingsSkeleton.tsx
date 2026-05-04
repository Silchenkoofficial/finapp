import { Skeleton } from '../ui/skeleton'

function SectionSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-24 ml-1" />
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center px-4 py-3 border-b border-stone-100 last:border-0 gap-3">
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-4 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-5">
      <SectionSkeleton rows={2} />
      <SectionSkeleton rows={4} />
      <SectionSkeleton rows={6} />
      <SectionSkeleton rows={1} />
      <SectionSkeleton rows={4} />
    </div>
  )
}
