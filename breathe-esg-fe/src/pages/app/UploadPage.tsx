import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/app/StatusPill";

const sources = [
  { id: "sap", label: "SAP Export", hint: "GL accounts · cost centers · UOM" },
  { id: "utility", label: "Utility CSV", hint: "Electricity · gas · water" },
  { id: "travel", label: "Travel Data", hint: "Air · rail · hotel" },
] as const;

export default function UploadPage() {
  const [active, setActive] = useState<typeof sources[number]["id"]>("sap");
  const [dragging, setDragging] = useState(false);
  const [hasFile, setHasFile] = useState(true);

  return (
  <>
    <PageTitle title="Upload data — Breathe ESG" />
    <div className="space-y-7">
      <PageHeader
        eyebrow="Ingestion"
        title="Upload dataset"
        description="Drop in a source export. We parse, normalize, and stage records for review — without modifying the raw file."
      />

      <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
        {sources.map((s) => (
          <button
            key={s.id}
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
        <div className="xl:col-span-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); setHasFile(true); }}
            className={`relative overflow-hidden rounded-xl border border-dashed bg-surface p-12 text-center transition ${
              dragging ? "border-accent bg-surface-2" : "border-border-strong"
            }`}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot opacity-40 mask-fade-b" />
            <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-lg border border-border bg-surface-2 text-accent">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 16V4m0 0-4 4m4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
              </svg>
            </div>
            <h3 className="relative mt-5 font-display text-lg font-medium text-foreground">Drop your file to ingest</h3>
            <p className="relative mt-1.5 text-[13px] text-muted-foreground">CSV, XLSX, or JSON · up to 250 MB · raw payload preserved</p>
            <div className="relative mt-5 flex items-center justify-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground transition hover:bg-foreground/90">
                Browse files
              </button>
              <span className="text-[11.5px] text-muted-foreground">or paste a presigned URL</span>
            </div>
          </div>

          {hasFile && (
            <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 font-mono text-[10px] text-muted-foreground">
                    {active === "sap" ? "SAP" : active === "utility" ? "UTL" : "TRV"}
                  </span>
                  <div>
                    <div className="text-[13px] text-foreground">
                      {active === "sap" ? "sap_q2_emissions_2026-05.csv" : active === "utility" ? "utility_apr_2026.csv" : "travel_q2_2026.json"}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">12,480 rows · 8.4 MB · sha256 9f4c…b21a</div>
                  </div>
                </div>
                <StatusPill status="validated" />
              </div>
              <div className="grid grid-cols-3 gap-px bg-border">
                {[
                  { l: "Processed", v: "12,445", tone: "text-foreground" },
                  { l: "Flagged",   v: "24",     tone: "text-amber" },
                  { l: "Failed",    v: "11",     tone: "text-rose" },
                ].map((s) => (
                  <div key={s.l} className="bg-surface p-4">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                    <div className={`mt-1 font-display text-xl font-medium tabular-nums ${s.tone}`}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2 font-medium">Row</th>
                      <th className="px-5 py-2 font-medium">Account / Source ID</th>
                      <th className="px-5 py-2 font-medium">Activity</th>
                      <th className="px-5 py-2 text-right font-medium">Qty</th>
                      <th className="px-5 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { r: "001", a: "640105 · MUC-PLT", act: "Natural gas", q: "88,420 m³", st: "approved" as const },
                      { r: "002", a: "640210 · FLT-EUW", act: "Diesel B7",   q: "14,820 L",  st: "pending"  as const },
                      { r: "003", a: "DE-FRA-441",      act: "Grid electricity", q: "482,104 kWh", st: "flagged" as const },
                      { r: "004", a: "640330 · HQ",     act: "R-410A",      q: "12.4 kg",    st: "rejected" as const },
                      { r: "005", a: "IE-DUB-12",       act: "Grid electricity", q: "22,408 kWh", st: "pending" as const },
                    ].map((r) => (
                      <tr key={r.r} className="border-t border-border transition hover:bg-surface-2">
                        <td className="px-5 py-2 font-mono text-[11px] text-muted-foreground">{r.r}</td>
                        <td className="px-5 py-2 font-mono text-[11.5px] text-foreground/90">{r.a}</td>
                        <td className="px-5 py-2 text-foreground">{r.act}</td>
                        <td className="px-5 py-2 text-right font-mono text-foreground tabular-nums">{r.q}</td>
                        <td className="px-5 py-2"><StatusPill status={r.st} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <span className="text-[11.5px] text-muted-foreground">Showing 5 of 12,480 staged rows</span>
                <div className="flex gap-2">
                  <button className="inline-flex items-center rounded-md border border-border bg-surface-2 px-3 py-1.5 text-[12px] text-foreground transition hover:bg-elevated">Discard</button>
                  <button className="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-[12px] font-medium text-primary-foreground transition hover:bg-foreground/90">Send to review queue</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-sm font-medium text-foreground">Parser configuration</h3>
            <dl className="mt-3 space-y-2.5 text-[12.5px]">
              {[
                ["Schema", active === "sap" ? "SAP S/4HANA · v2.4" : active === "utility" ? "Utility CSV · v1.6" : "Concur JSON · v3.1"],
                ["Emission factors", "DEFRA 2026 · GHG Protocol"],
                ["Period mapping", "FY26 Q2 (2026-04-01 → 2026-06-30)"],
                ["Reviewer pool", "EU sustainability team"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right text-foreground/90">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-sm font-medium text-foreground">Recent ingestions</h3>
            <ul className="mt-3 space-y-2.5 text-[12.5px]">
              {["UPL-4421 · SAP · 12,480", "UPL-4420 · Utility · 3,204", "UPL-4419 · Travel · 884"].map((r) => (
                <li key={r} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="font-mono text-[11.5px] text-foreground/90">{r}</span>
                  <span className="text-[11px] text-muted-foreground">2h ago</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </>
  );
}
