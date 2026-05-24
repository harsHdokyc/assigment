import { Logo } from "@/components/brand/Logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 text-[13px] md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-muted-foreground">
            Audit-grade emissions data infrastructure for enterprise sustainability teams.
          </p>
        </div>
        {[
          { h: "Product", l: ["Dashboard", "Ingestion", "Review queue", "Audit logs"] },
          { h: "Sources",  l: ["SAP", "Utility data", "Corporate travel", "Custom CSV"] },
          { h: "Company",  l: ["Security", "Compliance", "Customers", "Contact"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.h}</div>
            <ul className="mt-3 space-y-2 text-foreground/90">
              {c.l.map((i) => (
                <li key={i}><a className="transition hover:text-foreground" href="#">{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-[12px] text-muted-foreground">
          <span>© 2026 Breathe ESG, Inc.</span>
          <div className="flex items-center gap-5">
            <span>SOC 2 Type II</span>
            <span>GDPR</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
