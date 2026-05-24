import { useEffect, useState } from "react";
import type { ReviewRecord } from "@/lib/mock-data";
import { StatusPill } from "./StatusPill";

export function RecordDrawer({ record, onClose }: { record: ReviewRecord | null; onClose: () => void }) {
  const [tab, setTab] = useState<"data" | "history" | "lineage">("data");

  useEffect(() => {
    setTab("data");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [record, onClose]);

  const open = !!record;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[760px] flex-col border-l border-border bg-surface shadow-elevated transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {record && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="font-mono">{record.id}</span>
                  <span>·</span>
                  <span>{record.source}</span>
                  <span>·</span>
                  <span>{record.scope}</span>
                </div>
                <h2 className="mt-1 truncate font-display text-lg font-medium text-foreground">{record.activity}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusPill status={record.status} />
                  {record.validation && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-2 py-0.5 text-[11px] text-amber ring-1 ring-amber/25">
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v5M8 11v.5"/><circle cx="8" cy="8" r="6.5"/></svg>
                      {record.validation}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-surface-2 hover:text-foreground" aria-label="Close">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 4 8 8M12 4l-8 8"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-1 border-b border-border px-6">
              {(["data", "history", "lineage"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative -mb-px px-3 py-2.5 text-[12.5px] capitalize transition ${
                    tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "data" ? "Raw vs normalized" : t === "history" ? "Audit history" : "Lineage"}
                  {tab === t && <span className="absolute inset-x-0 bottom-0 h-px bg-accent" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {tab === "data" && (
                <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
                  <Panel title="Raw source" subtitle="Preserved verbatim from origin">
                    <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 font-mono text-[11.5px] leading-relaxed text-foreground/90">
                      {JSON.stringify(record.raw, null, 2)}
                    </pre>
                  </Panel>
                  <Panel title="Normalized record" subtitle="Editable · changes audited">
                    <div className="space-y-2">
                      {Object.entries(record.normalized).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[140px_1fr] items-center gap-3">
                          <label className="text-[11.5px] text-muted-foreground">{k}</label>
                          <input
                            defaultValue={String(v)}
                            className="h-8 w-full rounded-md border border-border bg-background px-2.5 font-mono text-[12px] text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              )}

              {tab === "history" && (
                <div className="p-6">
                  <ol className="relative space-y-5">
                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                    {[
                      { a: "S. Patel", v: "Flagged record", t: "2m ago" },
                      { a: "system", v: "Validation: spike vs baseline", t: "3m ago" },
                      { a: "L. Chen", v: "Normalized from UPL-4420", t: "1h ago" },
                      { a: "system", v: "Ingested from utility CSV", t: "1h ago" },
                    ].map((e, i) => (
                      <li key={i} className="relative grid grid-cols-[16px_1fr_auto] items-start gap-4">
                        <span className="mt-1.5 h-3.5 w-3.5 rounded-full border border-border bg-surface-2">
                          <span className="block h-full w-full scale-[0.45] rounded-full bg-foreground/70" />
                        </span>
                        <div>
                          <div className="text-[13px] text-foreground"><span className="text-muted-foreground">{e.a}</span> · {e.v}</div>
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">{e.t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {tab === "lineage" && (
                <div className="p-6">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px]">
                      <span className="rounded bg-surface-2 px-2 py-1 text-muted-foreground">utility_apr_2026.csv</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="rounded bg-surface-2 px-2 py-1 text-muted-foreground">UPL-4420</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="rounded bg-surface-2 px-2 py-1 text-foreground ring-1 ring-accent/40">{record.id}</span>
                    </div>
                    <div className="mt-3 text-[12px] text-muted-foreground">SHA-256: <span className="font-mono text-foreground/80">9f4c2a…b21a</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-2/60 px-6 py-3.5">
              <button className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition hover:bg-elevated">
                Reject
              </button>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition hover:bg-elevated">
                  Edit
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald/90 px-3 py-1.5 text-[12.5px] font-medium text-background transition hover:bg-emerald">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 8 3 3 7-7"/></svg>
                  Approve record
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface p-6">
      <div className="mb-3">
        <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-[11.5px] text-muted-foreground/80">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
