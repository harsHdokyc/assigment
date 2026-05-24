import { useMe, useLogout } from "@/hooks";

export function AppTopbar({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const { data: me } = useMe();
  const signOut = useLogout();

  return (
    <header className="sticky top-0 z-30 w-full min-w-0 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-14 min-w-0 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuOpen}
          className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-surface hover:text-foreground lg:hidden"
          aria-label="Open navigation menu"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
        </button>

        <div className="hidden min-w-0 items-center gap-2 text-[12.5px] text-muted-foreground md:flex">
          <button
            type="button"
            className="inline-flex max-w-[200px] cursor-pointer items-center gap-1.5 truncate rounded-md border border-border bg-surface px-2.5 py-1 text-foreground transition hover:bg-surface-2 lg:max-w-none"
          >
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-sm bg-accent/20 font-mono text-[9px] text-accent">
              N
            </span>
            <span className="truncate">{me?.organizations[0]?.name ?? "Organization"}</span>
            <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m4 6 4 4 4-4" />
            </svg>
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center">
          <button
            type="button"
            onClick={signOut}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md py-1 pl-1 pr-1 transition hover:bg-surface sm:pr-2"
            aria-label="Sign out"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-accent/40 to-sky/30 text-[11px] font-medium text-foreground ring-1 ring-border">
              {(me?.name ?? "A").slice(0, 2).toUpperCase()}
            </span>
            <span className="hidden text-left md:block">
              <span className="block text-[12px] leading-tight text-foreground">{me?.name ?? "Analyst"}</span>
              <span className="block text-[10px] leading-tight text-muted-foreground">Sign out</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
