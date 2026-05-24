import { StatusPill } from "@/components/app/StatusPill";

/**
 * Sophisticated, static dashboard preview rendered as real DOM (no images).
 * Mirrors the actual product surfaces — ingestion queue, validation, audit.
 */
export function DashboardMockup() {
  return (
    <div className="relative w-full">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-8 -top-12 -bottom-16 -z-10 bg-[radial-gradient(60%_50%_at_60%_0%,oklch(0.68_0.09_175/0.12),transparent_70%)]" />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">app.breathe-esg.com / review</span>
          </div>
          <span className="text-[11px] text-muted-foreground">FY26 · Q2</span>
        </div>

        {/* split layout */}
        <div className="grid grid-cols-12">
          {/* mini sidebar */}
          <aside className="col-span-3 border-r border-border bg-sidebar/60 p-3">
            {[
              { l: "Dashboard" },
              { l: "Upload data" },
              { l: "Review queue", active: true, badge: "42" },
              { l: "Audit logs" },
              { l: "Sources" },
              { l: "Settings" },
            ].map((i) => (
              <div
                key={i.l}
                className={`mb-0.5 flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] ${
                  i.active ? "bg-sidebar-accent text-foreground" : "text-muted-foreground"
                }`}
              >
                <span>{i.l}</span>
                {i.badge && <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-foreground/80 ring-1 ring-border">{i.badge}</span>}
              </div>
            ))}
          </aside>

          <div className="col-span-9 p-4">
            {/* stat strip */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { l: "Pending", v: "142", t: "+8" },
                { l: "Failed", v: "23", t: "−4" },
                { l: "Approved", v: "1,284", t: "+128" },
                { l: "Rows", v: "42.8k", t: "+3.2k" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border border-border bg-surface-2 p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="text-base font-semibold text-foreground">{s.v}</span>
                    <span className="text-[10px] text-emerald">{s.t}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* pipeline */}
            <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2">
              {["Upload", "Normalize", "Validate", "Review", "Lock"].map((s, i, a) => (
                <div key={s} className="flex flex-1 items-center gap-1.5">
                  <div className={`h-1.5 flex-1 rounded-full ${i < 3 ? "bg-emerald/70" : i === 3 ? "bg-amber/70" : "bg-white/[0.06]"}`} />
                  <span className={`text-[10px] ${i <= 3 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  {i < a.length - 1 && <span className="text-muted-foreground/40">·</span>}
                </div>
              ))}
            </div>

            {/* table */}
            <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface-2">
              <div className="grid grid-cols-12 gap-2 border-b border-border bg-surface px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="col-span-3">Source</span>
                <span className="col-span-4">Activity</span>
                <span className="col-span-2">Scope</span>
                <span className="col-span-3 text-right">Status</span>
              </div>
              {[
                { src: "Utility CSV", act: "Grid electricity — Frankfurt DC", scope: "Scope 2", st: "flagged" as const },
                { src: "Travel Data", act: "Air — LHR → SFO", scope: "Scope 3", st: "flagged" as const },
                { src: "SAP Export", act: "Diesel — Fleet EU-W", scope: "Scope 1", st: "pending" as const },
                { src: "SAP Export", act: "Natural gas — Munich", scope: "Scope 1", st: "approved" as const },
                { src: "Utility CSV", act: "Grid electricity — Dublin", scope: "Scope 2", st: "pending" as const },
              ].map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center gap-2 border-b border-border px-3 py-2 text-[11px] last:border-0"
                >
                  <span className="col-span-3 text-muted-foreground">{r.src}</span>
                  <span className="col-span-4 text-foreground">{r.act}</span>
                  <span className="col-span-2 font-mono text-[10px] text-muted-foreground">{r.scope}</span>
                  <span className="col-span-3 flex justify-end">
                    <StatusPill status={r.st} />
                  </span>
                </div>
              ))}
            </div>

            {/* validation panel */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Validation alerts</div>
                <ul className="mt-1.5 space-y-1.5 text-[11px]">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber" /><span className="text-foreground/90">Electricity spike +41% vs baseline · <span className="text-muted-foreground">FRA DC</span></span></li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber" /><span className="text-foreground/90">Missing airport code · <span className="text-muted-foreground">LHR → ∅</span></span></li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose" /><span className="text-foreground/90">Invalid unit (kWh expected)</span></li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent audit</div>
                <ul className="mt-1.5 space-y-1.5 font-mono text-[10px] text-muted-foreground">
                  <li><span className="text-foreground">M. Aoki</span> approved REC-90017</li>
                  <li><span className="text-foreground">system</span> validated UPL-4420</li>
                  <li><span className="text-foreground">J. Bauer</span> edited distance_km</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
