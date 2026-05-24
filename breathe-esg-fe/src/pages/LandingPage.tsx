import { Link } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { DashboardMockup } from "@/components/landing/DashboardMockup";

export default function LandingPage() {
  return (
    <>
      <PageTitle title="Breathe ESG — Enterprise emissions data without the spreadsheet chaos" />
      <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <Hero />
      <Workflow />
      <Sources />
      <Audit />
      <CTA />
      <LandingFooter />
    </div>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.68_0.09_175/0.12),transparent)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pb-24 pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-28">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            FY26 reporting season — now open
          </div>
          <h1 className="mt-6 text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[56px]">
            Enterprise emissions data without the spreadsheet chaos.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Ingest messy sustainability data from SAP, utility portals, and travel systems into a
            review-ready audit workflow. Every record traceable. Every change logged.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-primary-foreground transition hover:bg-foreground/90"
            >
              View dashboard
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 3 5 5-5 5" /></svg>
            </Link>
            <Link
              to="/app/upload"
              className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-4 py-2 text-[13px] font-medium text-foreground transition hover:bg-surface-2"
            >
              Upload dataset
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              { v: "42M+", l: "rows ingested" },
              { v: "99.98%", l: "validation accuracy" },
              { v: "SOC 2", l: "Type II audited" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</dt>
                <dd className="mt-1 font-display text-xl font-medium text-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const items = [
    {
      h: "Ingest",
      p: "Pipe in SAP exports, utility CSVs, and corporate travel feeds. Raw source preserved, byte-for-byte, for every record.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
        </svg>
      ),
    },
    {
      h: "Normalize",
      p: "Units, scopes, and emission factors mapped automatically. Anomalies flagged before they reach a reviewer.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7h16M4 12h10M4 17h16" />
        </svg>
      ),
    },
    {
      h: "Review",
      p: "Analyst approval workflow with side-by-side raw vs normalized data. Approve, reject, or edit — every action audit-logged.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m5 12 4 4 10-10" />
        </svg>
      ),
    },
  ];
  return (
    <section id="workflow" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-wider text-accent">Trusted workflow</div>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Built for the way sustainability teams actually work.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            A single operational surface for ingestion, normalization, and analyst approval — without
            losing the auditability your assurance partners require.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {items.map((i, idx) => (
            <div key={i.h} className="group bg-surface p-7 transition hover:bg-surface-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface-2 text-accent">{i.icon}</span>
                <span className="font-mono text-[11px]">0{idx + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-foreground">{i.h}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{i.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sources() {
  const items = [
    {
      tag: "ERP",
      h: "SAP Export",
      p: "Native parser for GL accounts, cost centers, and quantity UOMs. Maps to Scope 1 & 3 categories.",
      meta: ["CSV / XLSX", "Scheduled · Manual", "Fingerprinted"],
    },
    {
      tag: "Utility",
      h: "Utility CSV",
      p: "Electricity, gas, water, and steam meter readings. Auto-matched to facilities and emission factors.",
      meta: ["CSV / API", "Period-aware", "Spike detection"],
    },
    {
      tag: "Travel",
      h: "Travel Expense Feed",
      p: "Air, rail, hotel, and ground-transport data from Concur, Navan, and direct booking exports.",
      meta: ["JSON / CSV", "DEFRA factors", "Airport resolution"],
    },
  ];
  return (
    <section id="sources" className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-wider text-accent">Source integrations</div>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Connect the systems your data already lives in.
            </h2>
          </div>
          <span className="hidden text-[12px] text-muted-foreground md:inline">+ Custom CSV mapper</span>
        </div>

        <div className="mt-10 space-y-3">
          {items.map((i) => (
            <article
              key={i.h}
              className="group grid grid-cols-12 items-center gap-4 rounded-xl border border-border bg-surface p-5 transition hover:bg-surface-2"
            >
              <div className="col-span-12 flex items-center gap-3 md:col-span-3">
                <span className="inline-flex items-center rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {i.tag}
                </span>
                <h3 className="font-display text-base font-medium text-foreground">{i.h}</h3>
              </div>
              <p className="col-span-12 text-[13.5px] leading-relaxed text-muted-foreground md:col-span-6">{i.p}</p>
              <div className="col-span-12 flex flex-wrap justify-start gap-1.5 md:col-span-3 md:justify-end">
                {i.meta.map((m) => (
                  <span key={m} className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">{m}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Audit() {
  const steps = [
    { t: "Raw source preserved", d: "Original payloads stored verbatim with content hash." },
    { t: "Normalization", d: "Units, factors, and scopes mapped with reversible lineage." },
    { t: "Validation", d: "Range, unit, and anomaly checks before analyst review." },
    { t: "Analyst review", d: "Approve, reject, or edit with mandatory comments." },
    { t: "Audit lock", d: "Cryptographic seal — no further edits without re-review." },
  ];
  return (
    <section id="audit" className="border-b border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="text-[11px] uppercase tracking-wider text-accent">Audit & traceability</div>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Every figure traceable back to its source row.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Built for the level of evidence your assurance team expects. Field-level change history,
            actor metadata, and immutable audit locks — without slowing your reviewers down.
          </p>

          <ul className="mt-8 space-y-2.5 text-[13.5px] text-muted-foreground">
            {["SOC 2 Type II audited", "Field-level change history", "Role-based approvals", "Immutable audit trail"].map((l) => (
              <li key={l} className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-emerald" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 8 3 3 7-7" /></svg>
                <span className="text-foreground/90">{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="relative rounded-2xl border border-border bg-surface p-6 shadow-elevated">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">pipeline · REC-90017</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-emerald ring-1 ring-emerald/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                Audit locked
              </span>
            </div>
            <ol className="relative space-y-5">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
              {steps.map((s, i) => (
                <li key={s.t} className="relative grid grid-cols-[16px_1fr] gap-4">
                  <span className={`mt-1.5 h-3.5 w-3.5 rounded-full border ${i < 4 ? "border-emerald/40 bg-emerald/20" : "border-foreground/30 bg-foreground/10"}`}>
                    <span className={`block h-full w-full rounded-full ${i < 4 ? "bg-emerald/70" : "bg-foreground/70"} scale-[0.45]`} />
                  </span>
                  <div>
                    <div className="text-[13.5px] font-medium text-foreground">{s.t}</div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {[
                { l: "Actor", v: "M. Aoki" },
                { l: "Sealed", v: "May 23, 17:30" },
                { l: "Hash", v: "9f4c…b21a" },
              ].map((f) => (
                <div key={f.l} className="bg-surface-2 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.l}</div>
                  <div className="mt-1 font-mono text-[12px] text-foreground">{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-10 shadow-elevated sm:p-14">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot opacity-40 mask-fade-b" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                Close your reporting season with confidence.
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground">
                See the full operational surface, with realistic enterprise data preloaded.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/app/dashboard" className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-primary-foreground transition hover:bg-foreground/90">
                Open the app
              </Link>
              <a href="#" className="inline-flex items-center rounded-md border border-border-strong bg-surface-2 px-4 py-2 text-[13px] font-medium text-foreground transition hover:bg-elevated">
                Talk to sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
