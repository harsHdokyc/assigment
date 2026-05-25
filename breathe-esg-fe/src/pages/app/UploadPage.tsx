import { useRef, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/app/StatusPill";
import {
  useDataSources,
  useOrganizationId,
  useRecordsPreview,
  useUpload,
} from "@/hooks";
import type { UploadResult } from "@/lib/types";
import { mapListItem } from "@/lib/record-mapper";

const sources = [
  { id: "sap", label: "SAP Export", hint: "Fuel · procurement · mixed units" },
  { id: "utility", label: "Utility CSV", hint: "Electricity · kWh / MWh" },
  { id: "travel", label: "Travel Data", hint: "Flights · hotels · rail" },
] as const;

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState<(typeof sources)[number]["id"]>("sap");
  const [summary, setSummary] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");

  const orgId = useOrganizationId();
  const { data: recent } = useDataSources();
  const upload = useUpload();
  const { data: preview } = useRecordsPreview(!!summary);

  const previewRows = preview?.results.slice(0, 5).map(mapListItem) ?? [];

  function onFile(file: File | null) {
    if (!file) return;
    if (!orgId) {
      setError("No organization. Sign out and sign in again.");
      return;
    }
    setError("");
    upload.mutate(
      { file, sourceType: active },
      {
        onSuccess: (data) => setSummary(data),
        onError: () => setError("Upload failed. Check API is running and you are signed in."),
      }
    );
  }

  return (
    <>
      <PageTitle title="Upload data — Breathe ESG" />
      <div className="space-y-7">
        <PageHeader
          eyebrow="Ingestion"
          title="Upload dataset"
          description="CSV only. Raw rows are preserved; normalization and validation run automatically."
        />

        <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-1 sm:flex-row sm:items-stretch">
          {sources.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`flex-1 rounded-md px-3 py-2 text-left text-[13px] transition ${
                active === s.id ? "bg-surface-2 text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="font-medium">{s.label}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{s.hint}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-5">
            <div
              className="relative overflow-hidden rounded-xl border border-dashed border-border-strong bg-surface p-12 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files[0] ?? null);
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <h3 className="font-display text-lg font-medium text-foreground">Drop CSV or browse</h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground">Up to 5,000 rows · samples in backend repo</p>
              <button
                type="button"
                disabled={upload.isPending}
                onClick={() => fileRef.current?.click()}
                className="mt-5 inline-flex rounded-md bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground disabled:opacity-60"
              >
                {upload.isPending ? "Uploading…" : "Browse files"}
              </button>
              {error && <p className="mt-3 text-[13px] text-rose">{error}</p>}
            </div>

            {summary && (
              <div className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <div>
                    <div className="text-[13px] text-foreground">{summary.filename}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{summary.total_rows} rows ingested</div>
                  </div>
                  <StatusPill status="validated" />
                </div>
                <div className="grid grid-cols-3 gap-px bg-border">
                  {[
                    { l: "Pending", v: summary.pending_count, tone: "text-foreground" },
                    { l: "Flagged", v: summary.flagged_count, tone: "text-amber" },
                    { l: "Failed", v: summary.failed_count, tone: "text-rose" },
                  ].map((s) => (
                    <div key={s.l} className="bg-surface p-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                      <div className={`mt-1 font-display text-xl font-medium tabular-nums ${s.tone}`}>{s.v}</div>
                    </div>
                  ))}
                </div>
                {previewRows.length > 0 && (
                  <div className="overflow-x-auto border-t border-border">
                    <table className="w-full text-[12.5px]">
                      <tbody>
                        {previewRows.map((r) => (
                          <tr key={r.id} className="border-t border-border">
                            <td className="px-5 py-2 font-mono text-[11px]">{r.displayRef}</td>
                            <td className="px-5 py-2">{r.activity}</td>
                            <td className="px-5 py-2 text-right font-mono">
                              {r.value.toLocaleString()} {r.unit}
                            </td>
                            <td className="px-5 py-2">
                              <StatusPill status={r.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-sm font-medium text-foreground">Recent ingestions</h3>
            <ul className="mt-3 space-y-2.5 text-[12.5px]">
              {(recent ?? []).slice(0, 6).map((r) => (
                <li key={r.id} className="flex justify-between gap-2 border-b border-border pb-2 last:border-0">
                  <span className="font-mono text-[11px]">{r.filename}</span>
                  <span className="text-muted-foreground">{r.total_rows} rows</span>
                </li>
              ))}
              {!recent?.length && <li className="text-muted-foreground">No uploads yet</li>}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
