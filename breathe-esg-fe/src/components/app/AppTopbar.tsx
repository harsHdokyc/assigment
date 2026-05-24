export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-6 lg:px-8">
        <div className="hidden items-center gap-2 text-[12.5px] text-muted-foreground md:flex">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-foreground transition hover:bg-surface-2">
            <span className="grid h-4 w-4 place-items-center rounded-sm bg-accent/20 font-mono text-[9px] text-accent">N</span>
            <span>Northwind Industries</span>
            <svg viewBox="0 0 16 16" className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 6 4 4 4-4"/></svg>
          </button>
          <span className="text-border">/</span>
          <span>FY26 · Q2</span>
        </div>

        <div className="ml-2 flex max-w-md flex-1 items-center">
          <label className="group relative w-full">
            <svg viewBox="0 0 16 16" className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" />
            </svg>
            <input
              placeholder="Search records, uploads, actors…"
              className="h-8 w-full rounded-md border border-border bg-surface pl-8 pr-12 text-[13px] text-foreground placeholder:text-muted-foreground/70 transition focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">⌘ K</kbd>
          </label>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button className="relative grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-surface hover:text-foreground" aria-label="Notifications">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 12V7a4.5 4.5 0 1 1 9 0v5l1.5 1.5h-12L3.5 12Z"/><path d="M6.5 14a1.5 1.5 0 0 0 3 0"/></svg>
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber ring-2 ring-background" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-surface hover:text-foreground" aria-label="Help">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M6.5 6.5a1.5 1.5 0 1 1 2.4 1.2c-.6.4-.9.7-.9 1.3M8 11.5h.01"/></svg>
          </button>
          <div className="mx-1 h-5 w-px bg-border" />
          <button className="inline-flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition hover:bg-surface" aria-label="Account">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-accent/40 to-sky/30 text-[11px] font-medium text-foreground ring-1 ring-border">MA</span>
            <span className="hidden text-left md:block">
              <span className="block text-[12px] leading-tight text-foreground">Mei Aoki</span>
              <span className="block text-[10px] leading-tight text-muted-foreground">Lead analyst</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
