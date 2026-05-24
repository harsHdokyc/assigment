/**
 * Abstract product illustration — no sample metrics or record IDs.
 */
export function HeroPipelineVisual() {
  const stages = ["Upload", "Normalize", "Validate", "Review", "Lock"];
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated">
      <div className="border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] text-muted-foreground">Ingestion pipeline</span>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {stages.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`rounded-md px-2.5 py-1 text-[12px] ${
                  i < stages.length - 1
                    ? "bg-surface-2 text-foreground ring-1 ring-border"
                    : "bg-accent/10 text-accent ring-1 ring-accent/25"
                }`}
              >
                {s}
              </span>
              {i < stages.length - 1 && <span className="text-muted-foreground/40">→</span>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Raw source</div>
            <div className="mt-2 h-16 rounded bg-background/80 border border-dashed border-border" />
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Normalized + audit</div>
            <div className="mt-2 h-16 rounded bg-background/80 border border-dashed border-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
