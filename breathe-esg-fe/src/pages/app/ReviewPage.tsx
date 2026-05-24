import { useMemo, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/app/StatusPill";
import { RecordDrawer } from "@/components/app/RecordDrawer";
import { useRecords } from "@/hooks";
import { mapListItem } from "@/lib/record-mapper";
import type { Status } from "@/lib/types";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const listFilters = {
    status: active === "all" ? undefined : active,
    page,
  };

  const { data, isLoading, isError } = useRecords(listFilters);

  const rows = useMemo(() => {
    const list = (data?.results ?? []).map(mapListItem);
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter((r) => `${r.activity} ${r.id} ${r.source}`.toLowerCase().includes(q));
  }, [data, query]);

  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <>
      <PageTitle title="Review queue — Breathe ESG" />
      <div className="space-y-7">
        <PageHeader
          eyebrow="Operational"
          title="Review queue"
          description="Approve, reject, or edit normalized records. Every change is audited."
        />

        {isError && (
          <p className="rounded-lg border border-rose/30 bg-rose/10 px-4 py-3 text-[13px] text-rose">
            Could not load records. Is the API running at {import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"}?
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-0.5 rounded-md border border-border bg-surface p-0.5">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActive(f.id);
                  setPage(1);
                }}
                className={`rounded px-2.5 py-1 text-[12px] transition ${
                  active === f.id ? "bg-surface-2 text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative ml-auto w-full max-w-xs">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter records"
              className="h-8 w-full rounded-md border border-border bg-surface px-3 text-[12.5px] text-foreground"
            />
          </label>
        </div>

        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
          {isLoading ? (
            <div className="px-5 py-16 text-center text-[13px] text-muted-foreground">Loading records…</div>
          ) : (
            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-[720px] text-[13px]">
                <thead>
                  <tr className="text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Source</th>
                    <th className="px-5 py-3 font-medium">Scope</th>
                    <th className="px-5 py-3 font-medium">Activity</th>
                    <th className="px-5 py-3 text-right font-medium">Value</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Validation</th>
                    <th className="px-5 py-3 text-right font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center text-muted-foreground">
                        No records. Upload a sample CSV first.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className="cursor-pointer border-t border-border hover:bg-surface-2"
                      >
                        <td className="px-5 py-3">
                          <div>{r.source}</div>
                          <div className="font-mono text-[10.5px] text-muted-foreground">{r.id.slice(0, 8)}…</div>
                        </td>
                        <td className="px-5 py-3 font-mono text-[11.5px]">{r.scope}</td>
                        <td className="px-5 py-3">{r.activity}</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums">{r.value.toLocaleString()}</td>
                        <td className="px-5 py-3 font-mono text-[11.5px]">{r.unit}</td>
                        <td className="px-5 py-3">
                          <StatusPill status={r.status} />
                        </td>
                        <td className="px-5 py-3 text-[12px] text-muted-foreground">{r.validation ?? "—"}</td>
                        <td className="px-5 py-3 text-right font-mono text-[11.5px]">{r.updated}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="text-[11.5px] text-muted-foreground">
              {total} records · page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-border px-2 py-1 text-[12px] disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-border px-2 py-1 text-[12px] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <RecordDrawer recordId={selectedId} onClose={() => setSelectedId(null)} />
      </div>
    </>
  );
}
