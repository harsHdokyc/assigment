import type { Status } from "@/lib/types";

const map: Record<
  Status | "processing" | "validated" | "review" | "locked",
  { label: string; dot: string; text: string; ring: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-muted-foreground/70",
    text: "text-muted-foreground",
    ring: "ring-border",
  },
  flagged: {
    label: "Flagged",
    dot: "bg-amber",
    text: "text-amber",
    ring: "ring-amber/25",
  },
  failed: {
    label: "Failed",
    dot: "bg-rose",
    text: "text-rose",
    ring: "ring-rose/25",
  },
  approved: {
    label: "Approved",
    dot: "bg-emerald",
    text: "text-emerald",
    ring: "ring-emerald/25",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-sky",
    text: "text-sky",
    ring: "ring-sky/25",
  },
  processing: {
    label: "Processing",
    dot: "bg-sky animate-pulse",
    text: "text-sky",
    ring: "ring-sky/25",
  },
  validated: {
    label: "Validated",
    dot: "bg-emerald",
    text: "text-emerald",
    ring: "ring-emerald/25",
  },
  review: {
    label: "In review",
    dot: "bg-amber",
    text: "text-amber",
    ring: "ring-amber/25",
  },
  locked: {
    label: "Audit locked",
    dot: "bg-muted-foreground/70",
    text: "text-foreground",
    ring: "ring-border-strong",
  },
};

export function StatusPill({
  status,
  className = "",
}: {
  status: keyof typeof map;
  className?: string;
}) {
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium ring-1 ${s.ring} ${s.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
