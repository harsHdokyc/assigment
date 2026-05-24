import { useMemo, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/app/StatusPill";
import { reviewQueue, type ReviewRecord, type Status } from "@/lib/mock-data";
import { RecordDrawer } from "@/components/app/RecordDrawer";

const filters: { id: Status | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "flagged", label: "Flagged" },
  { id: "failed", label: "Failed" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function ReviewPage() {
  const [active, setActive] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<ReviewRecord | null>(null);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return reviewQueue.filter((r) => {
      if (active !== "all" && r.status !== active) return false;
      if (query && !`${r.activity} ${r.id} ${r.source}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [active, query]);

  return (
  <>
    <PageTitle title="Review queue — Breathe ESG" />
    <div className="space-y-7">
      <PageHeader
        eyebrow="Operational"
        title="Review queue"
        description="Approve, reject, or edit normalized records. Every action is logged and field-level diffs are preserved."
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground transition hover:bg-surface-2">
              Assigned to me
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground transition hover:bg-foreground/90">
              Bulk approve
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-0.5 rounded-md border border-border bg-surface p-0.5">
          {filters.map((f) => {
            const count = f.id === "all" ? reviewQueue.length : reviewQueue.filter((r) => r.status === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] transition ${
                  active === f.id ? "bg-surface-2 text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
                <span className="font-mono text-[10px] text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </div>

        <label className="relative ml-auto w-full max-w-xs">
          <svg viewBox="0 0 16 16" className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter records"
            className="h-8 w-full rounded-md border border-border bg-surface pl-8 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground/70 transition focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground transition hover:bg-surface-2 hover:text-foreground">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M4 8h8M6 12h4"/></svg>
          Filters
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Scope</th>
                <th className="px-5 py-3 font-medium">Activity</th>
                <th className="px-5 py-3 text-right font-medium">Value</th>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Validation</th>
                <th className="px-5 py-3 font-medium">Reviewer</th>
                <th className="px-5 py-3 text-right font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16">
                    <EmptyState />
                  </td>
                </tr>
              ) : rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer border-t border-border transition hover:bg-surface-2"
                >
                  <td className="px-5 py-3">
                    <div className="text-foreground">{r.source}</div>
                    <div className="font-mono text-[10.5px] text-muted-foreground">{r.id}</div>
                  </td>
                  <td className="px-5 py-3 font-mono text-[11.5px] text-muted-foreground">{r.scope}</td>
                  <td className="px-5 py-3 text-foreground">{r.activity}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-foreground">{r.value.toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono text-[11.5px] text-muted-foreground">{r.unit}</td>
                  <td className="px-5 py-3"><StatusPill status={r.status} /></td>
                  <td className="px-5 py-3 text-[12px] text-muted-foreground">
                    {r.validation ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                        {r.validation}
                      </span>
                    ) : <span className="text-muted-foreground/50">—</span>}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.reviewer}</td>
                  <td className="px-5 py-3 text-right font-mono text-[11.5px] text-muted-foreground">{r.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <span className="text-[11.5px] text-muted-foreground">
            Showing <span className="text-foreground">{rows.length}</span> of {reviewQueue.length} records
          </span>
          <div className="flex items-center gap-1">
            <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"><svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m10 4-4 4 4 4"/></svg></button>
            <span className="font-mono text-[11.5px] text-muted-foreground">1 / 1</span>
            <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"><svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg></button>
          </div>
        </div>
      </div>

      <RecordDrawer record={selected} onClose={() => setSelected(null)} />
    </div>
  </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full border border-border bg-surface-2">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 12 4 4 10-10"/></svg>
      </div>
      <h3 className="mt-4 font-display text-base font-medium text-foreground">Everything approved</h3>
      <p className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">No records match this filter. Adjust the filters or pull in a new dataset to keep the queue moving.</p>
    </div>
  );
}
