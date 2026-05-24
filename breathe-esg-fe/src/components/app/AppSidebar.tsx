import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { label: "Dashboard",   to: "/app/dashboard", icon: IconDash },
  { label: "Upload data", to: "/app/upload",    icon: IconUpload },
  { label: "Review queue",to: "/app/review",    icon: IconReview, badge: 42 },
  { label: "Audit logs",  to: "/app/audit",     icon: IconAudit },
  { label: "Sources",     to: "/app/sources",   icon: IconSource },
  { label: "Settings",    to: "/app/settings",  icon: IconGear },
] as const;

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { pathname: path } = useLocation();
  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar/80 backdrop-blur transition-[width] duration-300 ease-out lg:flex lg:flex-col ${
        collapsed ? "w-[68px]" : "w-[244px]"
      }`}
    >
      <div className="flex h-14 items-center justify-between px-3.5">
        {collapsed ? (
          <Link to="/" className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface-2">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M10 2c2 3 5 4 5 8a5 5 0 1 1-10 0c0-4 3-5 5-8Z" />
            </svg>
          </Link>
        ) : (
          <Logo />
        )}
        <button
          onClick={onToggle}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={collapsed ? "m6 4 4 4-4 4" : "m10 4-4 4 4 4"} />
          </svg>
        </button>
      </div>

      <div className="px-2.5 pb-2 pt-1">
        {!collapsed && (
          <div className="px-2.5 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Workspace</div>
        )}
        <nav className="space-y-0.5">
          {nav.map((item) => {
            const active = path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                }`}
              >
                {active && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" />}
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {"badge" in item && item.badge ? (
                      <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80 ring-1 ring-border">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="rounded-lg border border-border bg-surface-2 p-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
              <span className="text-[11px] text-muted-foreground">FY26 Q2 · open</span>
            </div>
            <div className="mt-1.5 text-[12.5px] text-foreground">Reporting period</div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background">
              <div className="h-full w-[64%] rounded-full bg-accent/70" />
            </div>
            <div className="mt-1.5 flex justify-between text-[10.5px] text-muted-foreground">
              <span>64% complete</span>
              <span>32d left</span>
            </div>
          </div>
        ) : (
          <div className="grid h-8 w-full place-items-center rounded-md bg-surface-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          </div>
        )}
      </div>
    </aside>
  );
}

function IconDash(p: { className?: string }) { return (<svg viewBox="0 0 16 16" className={p.className} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="3" rx="1"/><rect x="9" y="7" width="5" height="7" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/></svg>); }
function IconUpload(p: { className?: string }) { return (<svg viewBox="0 0 16 16" className={p.className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 10V3m0 0L5 6m3-3 3 3M3 11v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1"/></svg>); }
function IconReview(p: { className?: string }) { return (<svg viewBox="0 0 16 16" className={p.className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h12M2 12h7"/><path d="m11 12 1.2 1.2L15 10.5"/></svg>); }
function IconAudit(p: { className?: string }) { return (<svg viewBox="0 0 16 16" className={p.className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2h6l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"/><path d="M6 8h5M6 11h4"/></svg>); }
function IconSource(p: { className?: string }) { return (<svg viewBox="0 0 16 16" className={p.className} fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v4c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8v4c0 1.1 2.2 2 5 2s5-.9 5-2V8"/></svg>); }
function IconGear(p: { className?: string }) { return (<svg viewBox="0 0 16 16" className={p.className} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M3.05 3.05l1.4 1.4M11.55 11.55l1.4 1.4M1 8h2M13 8h2M3.05 12.95l1.4-1.4M11.55 4.45l1.4-1.4"/></svg>); }
