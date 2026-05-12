import { Skeleton } from '../ui/skeleton';

export function CarsharingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[80, 90, 75, 85].map((w, i) => <Skeleton key={i} className={`h-7 w-${w === 80 ? '20' : w === 90 ? '24' : w === 75 ? '20' : '22'} rounded-full`} />)}
        </div>
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
      <div className="text-center py-8">
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}
