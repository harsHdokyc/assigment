import { AppShellSkeleton } from "@/components/skeletons/AppShellSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

function MarketingFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-background" aria-busy="true" aria-label="Loading">
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <Skeleton className="h-7 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-6 py-16">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
      </main>
    </div>
  );
}

/** Shown while lazy route chunks load. */
export function RouteFallback() {
  const isApp =
    typeof window !== "undefined" && window.location.pathname.startsWith("/app");

  if (isApp) {
    return <AppShellSkeleton />;
  }

  return <MarketingFallback />;
}
