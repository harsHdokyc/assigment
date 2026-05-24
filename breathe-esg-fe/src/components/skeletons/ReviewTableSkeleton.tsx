import { Skeleton } from "@/components/ui/skeleton";

export function ReviewTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface" aria-busy="true">
      <div className="border-b border-border px-5 py-3">
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-8 gap-3 px-5 py-3">
            <div className="col-span-2 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3.5 w-12 justify-self-end" />
            <Skeleton className="h-3.5 w-8" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-10 justify-self-end" />
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t border-border px-5 py-3">
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-7 w-12" />
        </div>
      </div>
    </div>
  );
}
