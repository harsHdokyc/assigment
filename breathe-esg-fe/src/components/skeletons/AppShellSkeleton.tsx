import { Skeleton } from "@/components/ui/skeleton";

/** Lazy-route fallback for /app/* pages. */
export function AppShellSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-background" aria-busy="true" aria-label="Loading">
      <aside className="hidden w-[244px] shrink-0 border-r border-border bg-sidebar/50 p-3 lg:block">
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-border px-4 sm:px-6">
          <Skeleton className="h-8 w-8 lg:hidden" />
          <Skeleton className="hidden h-8 w-36 md:block" />
          <Skeleton className="ml-auto h-8 w-24 rounded-full" />
        </div>
        <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </main>
      </div>
    </div>
  );
}
