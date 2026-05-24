import { Link } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/app/StatusPill";
import { uploads, stats } from "@/lib/mock-data";

const statCards = [
  { l: "Pending reviews", v: stats.pending.toLocaleString(), t: stats.pendingTrend, tone: "text-amber" },
  { l: "Failed records",  v: stats.failed.toLocaleString(),  t: stats.failedTrend,  tone: "text-emerald" },
  { l: "Approved records", v: stats.approved.toLocaleString(), t: stats.approvedTrend, tone: "text-emerald" },
  { l: "Total uploaded rows", v: stats.totalRows.toLocaleString(), t: stats.rowsTrend, tone: "text-emerald" },
];

export default function DashboardPage() {
  return (
  <>
    <PageTitle title="Dashboard — Breathe ESG" />
    <div className="space-y-7">
      <PageHeader
        eyebrow="Overview"
        title="Operational dashboard"
        description="Pipeline health, review backlog, and validation signals across the FY26 reporting period."
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition hover:bg-surface-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Last 7 days
              <svg viewBox="0 0 16 16" className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 6 4 4 4-4"/></svg>
            </button>
            <Link to="/app/upload" className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground transition hover:bg-foreground/90">
              New upload
            </Link>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-surface p-5 shadow-soft transition hover:bg-surface-2">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-medium tracking-tight text-foreground tabular-nums">{s.v}</span>
              <span className={`text-[11.5px] ${s.tone}`}>{s.t}</span>
            </div>
            <Sparkline />
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-medium text-foreground">Processing pipeline</h2>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground">Live ingestion flow across all sources.</p>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">7 datasets in flight</span>
        </div>
        <Pipeline />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="font-display text-base font-medium text-foreground">Recent uploads</h2>
            <Link to="/app/upload" className="text-[12px] text-muted-foreground transition hover:text-foreground">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium">Source</th>
                  <th className="px-5 py-2.5 font-medium">Uploaded by</th>
                  <th className="px-5 py-2.5 text-right font-medium">Rows</th>
                  <th className="px-5 py-2.5 text-right font-medium">Failed</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((u) => (
                  <tr key={u.id} className="border-t border-border transition hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-md border border-border bg-surface-2 font-mono text-[10px] text-muted-foreground">
                          {u.source[0]}
                        </span>
                        <div>
                          <div className="text-foreground">{u.source}</div>
                          <div className="font-mono text-[10.5px] text-muted-foreground">{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.uploadedBy}</td>
                    <td className="px-5 py-3 text-right text-foreground tabular-nums">{u.rows.toLocaleString()}</td>
                    <td className={`px-5 py-3 text-right tabular-nums ${u.failed > 0 ? "text-amber" : "text-muted-foreground"}`}>{u.failed}</td>
                    <td className="px-5 py-3"><StatusPill status={u.status} /></td>
                    <td className="px-5 py-3 text-right font-mono text-[11.5px] text-muted-foreground">{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="font-display text-base font-medium text-foreground">Validation alerts</h2>
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground ring-1 ring-border">3 active</span>
          </div>
          <ul className="divide-y divide-border">
            {[
              { tone: "amber", t: "Electricity spike +41%", d: "Frankfurt DC · vs 12-mo baseline", id: "REC-90021" },
              { tone: "amber", t: "Missing airport code", d: "LHR → ∅ on REC-90020", id: "REC-90020" },
              { tone: "rose", t: "Invalid unit (kWh expected)", d: "Singapore DC · period 2026-04", id: "REC-90015" },
            ].map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-surface-2">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.tone === "amber" ? "bg-amber" : "bg-rose"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-foreground">{a.t}</div>
                  <div className="mt-0.5 text-[11.5px] text-muted-foreground">{a.d}</div>
                </div>
                <Link to="/app/review" className="font-mono text-[10.5px] text-muted-foreground transition hover:text-foreground">{a.id} →</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  </>
  );
}

function Pipeline() {
  const stages = [
    { l: "Upload",    c: 12, tone: "emerald" },
    { l: "Normalize", c: 8,  tone: "emerald" },
    { l: "Validate",  c: 7,  tone: "sky" },
    { l: "Review",    c: 42, tone: "amber" },
    { l: "Audit lock", c: 1284, tone: "muted" },
  ];
  const colors: Record<string, string> = {
    emerald: "bg-emerald/70",
    sky: "bg-sky/70",
    amber: "bg-amber/70",
    muted: "bg-foreground/40",
  };
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
      {stages.map((s, i) => (
        <div key={s.l} className="relative">
          <div className="rounded-lg border border-border bg-surface-2 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-muted-foreground">{s.l}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${colors[s.tone]}`} />
            </div>
            <div className="mt-2 font-display text-xl font-medium tabular-nums text-foreground">{s.c.toLocaleString()}</div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background">
              <div className={`h-full ${colors[s.tone]}`} style={{ width: `${[14, 30, 22, 64, 92][i]}%` }} />
            </div>
          </div>
          {i < stages.length - 1 && (
            <span aria-hidden className="absolute -right-2 top-1/2 hidden h-px w-3 -translate-y-1/2 bg-border sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}

function Sparkline() {
  const pts = [6, 8, 7, 10, 12, 11, 14, 13, 16, 15, 18, 22];
  const max = Math.max(...pts);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 100} ${30 - (p / max) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" className="mt-3 h-7 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.09 175 / 0.35)" />
          <stop offset="100%" stopColor="oklch(0.68 0.09 175 / 0)" />
        </linearGradient>
      </defs>
      <path d={`${d} L 100 32 L 0 32 Z`} fill="url(#sg)" />
      <path d={d} stroke="oklch(0.68 0.09 175)" strokeWidth="1.25" fill="none" />
    </svg>
  );
}
