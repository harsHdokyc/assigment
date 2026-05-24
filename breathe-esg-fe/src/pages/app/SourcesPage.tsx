import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";

const connections = [
  { tag: "ERP",      name: "SAP S/4HANA",      state: "connected", last: "10 min ago", count: "12,480 rows · last sync", desc: "GL accounts, cost centers, and quantity UOMs." },
  { tag: "Utility",  name: "EnBW (DE)",        state: "connected", last: "1 hour ago", count: "482,104 kWh · April",       desc: "Grid electricity for Frankfurt DC." },
  { tag: "Utility",  name: "ESB (IE)",         state: "connected", last: "1 hour ago", count: "22,408 kWh · April",        desc: "Grid electricity for Dublin office." },
  { tag: "Travel",   name: "SAP Concur",       state: "connected", last: "3 hours ago", count: "884 trips · Q2 to date",   desc: "Air, rail, hotel, and ground transport." },
  { tag: "Travel",   name: "Navan",            state: "paused",    last: "2 days ago",  count: "—",                         desc: "Backup booking provider." },
  { tag: "Utility",  name: "Singapore Power",  state: "error",     last: "6 hours ago", count: "Invalid unit on REC-90015", desc: "Awaiting schema fix from vendor." },
];

const tone: Record<string, { dot: string; text: string }> = {
  connected: { dot: "bg-emerald", text: "text-emerald" },
  paused:    { dot: "bg-muted-foreground/70", text: "text-muted-foreground" },
  error:     { dot: "bg-rose", text: "text-rose" },
};

export default function SourcesPage() {
  return (
  <>
    <PageTitle title="Sources — Breathe ESG" />
    <div className="space-y-7">
      <PageHeader
        eyebrow="Integrations"
        title="Sources"
        description="Connected enterprise systems streaming emissions data into Breathe ESG."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground transition hover:bg-foreground/90">
            + Connect source
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {connections.map((c) => (
          <article key={c.name} className="group rounded-xl border border-border bg-surface p-5 transition hover:bg-surface-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {c.tag}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[11px] ${tone[c.state].text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${tone[c.state].dot}`} />
                {c.state}
              </span>
            </div>
            <h3 className="mt-3.5 font-display text-base font-medium text-foreground">{c.name}</h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{c.desc}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11.5px]">
              <span className="text-muted-foreground">Last sync · {c.last}</span>
              <span className="font-mono text-foreground/90">{c.count}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </>
  );
}
