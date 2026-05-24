import { useMemo } from "react";
import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { useDataSources } from "@/hooks";
import type { DataSourceItem } from "@/lib/types";

const SOURCE_CATALOG = [
  {
    type: "sap",
    tag: "ERP",
    name: "SAP Export",
    desc: "Fuel and procurement CSV exports with German headers and mixed units.",
  },
  {
    type: "utility",
    tag: "Utility",
    name: "Utility CSV",
    desc: "Electricity portal exports — kWh, MWh, billing periods, meter IDs.",
  },
  {
    type: "travel",
    tag: "Travel",
    name: "Travel Data",
    desc: "Corporate travel CSV — flights, rail, hotels, ground transport.",
  },
] as const;

function summarizeByType(sources: DataSourceItem[]) {
  const map: Record<string, { uploads: number; rows: number; lastAt: string | null }> = {};
  for (const s of sources) {
    const cur = map[s.source_type] ?? { uploads: 0, rows: 0, lastAt: null };
    cur.uploads += 1;
    cur.rows += s.total_rows;
    if (!cur.lastAt || s.uploaded_at > cur.lastAt) cur.lastAt = s.uploaded_at;
    map[s.source_type] = cur;
  }
  return map;
}

export default function SourcesPage() {
  const { data: sources, isLoading, isError } = useDataSources();
  const byType = useMemo(() => summarizeByType(sources ?? []), [sources]);

  return (
    <>
      <PageTitle title="Sources — Breathe ESG" />
      <div className="space-y-7">
        <PageHeader
          eyebrow="Ingestion"
          title="Data sources"
          description="Supported CSV export types for this prototype. Upload counts reflect your organization's ingestions."
        />

        {isError && (
          <p className="text-[13px] text-rose">Could not load upload history. Check that the API is running.</p>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SOURCE_CATALOG.map((c) => {
            const stats = byType[c.type];
            const hasUploads = stats && stats.uploads > 0;
            return (
              <article key={c.type} className="rounded-xl border border-border bg-surface p-5">
                <span className="inline-flex rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                  {c.tag}
                </span>
                <h3 className="mt-3 font-display text-base font-medium text-foreground">{c.name}</h3>
                <p className="mt-1 text-[12.5px] text-muted-foreground">{c.desc}</p>
                <div className="mt-4 border-t border-border pt-3 text-[11.5px]">
                  {isLoading ? (
                    <span className="text-muted-foreground">Loading…</span>
                  ) : hasUploads ? (
                    <>
                      <div className="text-muted-foreground">
                        {stats.uploads} upload{stats.uploads === 1 ? "" : "s"} · {stats.rows.toLocaleString()} rows
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                        Last: {new Date(stats.lastAt!).toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">No uploads yet — use Upload data</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {(sources ?? []).length > 0 && (
          <section className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="font-display text-base font-medium">Upload history</h2>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[10px] uppercase text-muted-foreground">
                  <th className="px-5 py-2">File</th>
                  <th className="px-5 py-2">Type</th>
                  <th className="px-5 py-2 text-right">Rows</th>
                  <th className="px-5 py-2 text-right">Failed</th>
                  <th className="px-5 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {sources!.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-5 py-3 font-mono text-[11px]">{u.filename}</td>
                    <td className="px-5 py-3">{u.source_type}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{u.total_rows}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{u.failed_count}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.processing_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </>
  );
}
