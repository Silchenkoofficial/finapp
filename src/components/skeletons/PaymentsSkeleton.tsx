import { Skeleton } from '../ui/skeleton';

export function PaymentsSkeleton() {
  return (
    <div className="space-y-4">
      {[7, 2].map((count, gi) => (
        <div key={gi} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100 flex justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={`flex items-center px-4 py-3.5 gap-3 ${i < count - 1 ? 'border-b border-stone-100' : ''}`}>
              <Skeleton className="w-5 h-5 rounded-md shrink-0" />
              <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16 shrink-0" />
            </div>
          ))}
        </div>
      ))}
      <Skeleton className="h-11 w-full rounded-2xl" />
    </div>
  );
}
