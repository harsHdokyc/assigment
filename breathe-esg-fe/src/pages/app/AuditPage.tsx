import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { auditLog } from "@/lib/mock-data";

export default function AuditPage() {
  return (
  <>
    <PageTitle title="Audit logs — Breathe ESG" />
    <div className="space-y-7">
      <PageHeader
        eyebrow="Compliance"
        title="Audit logs"
        description="Immutable activity log across all actors, datasets, and records. Field-level diffs preserved for assurance."
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition hover:bg-surface-2">Export CSV</button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition hover:bg-surface-2">Last 30 days</button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="font-display text-base font-medium text-foreground">Activity timeline</h2>
          </div>
          <ol className="relative px-6 py-5">
            <div className="absolute left-[31px] top-6 bottom-6 w-px bg-border" />
            {auditLog.map((e) => (
              <li key={e.id} className="relative grid grid-cols-[20px_1fr_auto] items-start gap-4 py-3">
                <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${e.actor === "system" ? "bg-sky/70" : "bg-emerald/70"} ring-4 ring-surface`} />
                <div className="min-w-0">
                  <div className="text-[13px] text-foreground">
                    <span className="text-muted-foreground">{e.actor}</span>{" "}
                    {e.action.toLowerCase()}{" "}
                    <span className="font-mono text-foreground">{e.target}</span>
                  </div>
                  {e.field && (
                    <div className="mt-1 inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-[11px]">
                      <span className="text-muted-foreground">{e.field}:</span>
                      <span className="text-rose line-through">{e.before}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-emerald">{e.after}</span>
                    </div>
                  )}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{e.timestamp}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-sm font-medium text-foreground">Filters</h3>
            <div className="mt-3 space-y-3">
              {[
                { l: "Actor", o: ["Any", "Mei Aoki", "S. Patel", "J. Bauer", "system"] },
                { l: "Action", o: ["Any", "Approved", "Rejected", "Edited", "Locked"] },
                { l: "Target", o: ["Any", "Records", "Uploads"] },
              ].map((f) => (
                <label key={f.l} className="block">
                  <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">{f.l}</span>
                  <select className="mt-1 w-full appearance-none rounded-md border border-border bg-background px-2.5 py-1.5 text-[12.5px] text-foreground focus:border-border-strong focus:outline-none">
                    {f.o.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-sm font-medium text-foreground">Integrity</h3>
            <p className="mt-1.5 text-[12px] text-muted-foreground">Audit chain verified against the last seal.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2 py-0.5 text-[11px] text-emerald ring-1 ring-emerald/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Chain intact
            </div>
          </div>
        </aside>
      </div>
    </div>
  </>
  );
}
