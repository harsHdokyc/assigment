import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
            <a className="transition hover:text-foreground" href="#workflow">Workflow</a>
            <a className="transition hover:text-foreground" href="#sources">Sources</a>
            <a className="transition hover:text-foreground" href="#audit">Audit</a>
            <a className="transition hover:text-foreground" href="#pricing">Pricing</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/app/dashboard"
            className="hidden rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center rounded-md border border-border-strong bg-surface-2 px-3 py-1.5 text-[13px] text-foreground shadow-soft transition hover:bg-elevated"
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}
