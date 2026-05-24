import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { useAuditLog } from "@/hooks";

export default function AuditPage() {
  const { data: auditLog, isLoading } = useAuditLog();

  return (
    <>
      <PageTitle title="Audit logs — Breathe ESG" />
      <div className="space-y-7">
        <PageHeader
          eyebrow="Compliance"
          title="Audit logs"
          description="Field-level change history across all records in your organization."
        />

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {isLoading ? (
            <p className="px-5 py-12 text-center text-muted-foreground">Loading audit log…</p>
          ) : (
            <ol className="relative px-6 py-5">
              {(auditLog ?? []).map((e) => (
                <li
                  key={e.id}
                  className="grid grid-cols-[12px_1fr_auto] gap-4 py-3 border-b border-border last:border-0"
                >
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald/70" />
                  <div>
                    <div className="text-[13px]">
                      <span className="text-muted-foreground">{e.actor}</span> {e.action}{" "}
                      <span className="font-mono">{e.target.slice(0, 8)}…</span>
                    </div>
                    {e.field && (
                      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {e.field}: <span className="line-through">{e.before}</span> → {e.after}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{e.timestamp}</span>
                </li>
              ))}
              {!auditLog?.length && (
                <p className="py-12 text-center text-muted-foreground">
                  No audit events yet. Edit or approve a record.
                </p>
              )}
            </ol>
          )}
        </div>
      </div>
    </>
  );
}
