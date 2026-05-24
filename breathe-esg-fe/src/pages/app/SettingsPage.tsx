import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";

export default function SettingsPage() {
  return (
  <>
    <PageTitle title="Settings — Breathe ESG" />
    <div className="space-y-7">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Organization-level configuration, reviewer roles, and data retention policies."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:flex-col">
          {["Organization", "Reviewers", "Emission factors", "Notifications", "API keys", "Billing"].map((s, i) => (
            <button
              key={s}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-left text-[12.5px] transition ${
                i === 0 ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-base font-medium text-foreground">Organization</h2>
            <p className="mt-1 text-[12.5px] text-muted-foreground">These details appear in audit exports and assurance packages.</p>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ["Legal name", "Northwind Industries plc"],
                ["Reporting standard", "GHG Protocol · ISSB S2"],
                ["Reporting period", "FY26 · Apr 2026 – Mar 2027"],
                ["Base currency", "EUR"],
              ].map(([l, v]) => (
                <label key={l} className="block">
                  <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">{l}</span>
                  <input
                    defaultValue={v}
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] text-foreground focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-medium text-foreground">Reviewer pool</h2>
              <button className="text-[12px] text-muted-foreground transition hover:text-foreground">Manage roles →</button>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {[
                { n: "Mei Aoki", r: "Lead analyst", s: "Active now" },
                { n: "Saanvi Patel", r: "Senior reviewer", s: "Active 4m ago" },
                { n: "Jonas Bauer", r: "Travel specialist", s: "Active 1h ago" },
                { n: "Linh Chen", r: "Reviewer", s: "Idle" },
                { n: "Remi Okafor", r: "Reviewer", s: "Offline" },
              ].map((u) => (
                <li key={u.n} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent/30 to-sky/30 text-[11px] font-medium text-foreground ring-1 ring-border">
                      {u.n.split(" ").map((p) => p[0]).join("")}
                    </span>
                    <div>
                      <div className="text-[13px] text-foreground">{u.n}</div>
                      <div className="text-[11.5px] text-muted-foreground">{u.r}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{u.s}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  </>
  );
}
