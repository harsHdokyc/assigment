import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-7 w-7 place-items-center rounded-md border border-border bg-surface-2 shadow-soft">
        <span className="absolute inset-0 rounded-md bg-gradient-to-br from-accent/20 to-transparent" />
        <svg viewBox="0 0 20 20" className="relative h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M10 2c2 3 5 4 5 8a5 5 0 1 1-10 0c0-4 3-5 5-8Z" />
        </svg>
      </span>
      <span className="text-[15px] font-medium tracking-tight text-foreground">
        Breathe<span className="text-muted-foreground"> ESG</span>
      </span>
    </Link>
  );
}
