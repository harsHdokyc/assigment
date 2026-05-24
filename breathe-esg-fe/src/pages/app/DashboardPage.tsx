import { Link } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/app/StatusPill";
import { useDataSources, useFlaggedRecords, useStats } from "@/hooks";
import { mapListItem } from "@/lib/record-mapper";

export default function DashboardPage() {
  const { data: stats } = useStats();
  const { data: sources } = useDataSources();
  const { data: flagged } = useFlaggedRecords();

  const statCards = [
    { l: "Pending reviews", v: stats?.pending ?? 0, tone: "text-amber" },
    { l: "Failed records", v: stats?.failed ?? 0, tone: "text-rose" },
    { l: "Approved records", v: stats?.approved ?? 0, tone: "text-emerald" },
    { l: "Total uploaded rows", v: stats?.total_uploaded_rows ?? 0, tone: "text-foreground" },
  ];

  const alerts = (flagged?.results ?? []).slice(0, 5).map(mapListItem);

  return (
    <>
      <PageTitle title="Dashboard — Breathe ESG" />
      <div className="min-w-0 space-y-7">
        <PageHeader
          eyebrow="Overview"
          title="Operational dashboard"
          description="Live stats from the ingestion and review pipeline."
          actions={
            <Link
              to="/app/upload"
              className="rounded-md bg-foreground px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground"
            >
              New upload
            </Link>
          }
        />

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-surface p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className={`mt-2 font-display text-2xl font-medium tabular-nums ${s.tone}`}>
                {s.v.toLocaleString()}
              </div>
            </div>
          ))}
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2 overflow-hidden rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-3.5 flex justify-between">
              <h2 className="font-display text-base font-medium">Recent uploads</h2>
              <Link to="/app/upload" className="text-[12px] text-muted-foreground hover:text-foreground">
                Upload →
              </Link>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-[13px]">
              <thead>
                <tr className="text-left text-[10.5px] uppercase text-muted-foreground">
                  <th className="px-5 py-2">File</th>
                  <th className="px-5 py-2 text-right">Rows</th>
                  <th className="px-5 py-2 text-right">Failed</th>
                  <th className="px-5 py-2 text-right">Flagged</th>
                </tr>
              </thead>
              <tbody>
                {(sources ?? []).slice(0, 8).map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-5 py-3">{u.filename}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{u.total_rows}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-rose">{u.failed_count}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-amber">{u.flagged_count}</td>
                  </tr>
                ))}
                {!sources?.length && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                      No uploads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="font-display text-base font-medium">Validation alerts</h2>
            </div>
            <ul className="divide-y divide-border">
              {alerts.map((a) => (
                <li key={a.id} className="px-5 py-3.5">
                  <Link to="/app/review" className="text-[13px] text-foreground hover:underline">
                    {a.validation}
                  </Link>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{a.activity}</div>
                  <StatusPill status={a.status} />
                </li>
              ))}
              {!alerts.length && (
                <li className="px-5 py-8 text-[13px] text-muted-foreground">No flagged records</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
