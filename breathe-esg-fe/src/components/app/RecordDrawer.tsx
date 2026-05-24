import { useEffect, useState } from "react";
import {
  useApproveRecord,
  usePatchRecord,
  useRecord,
  useRejectRecord,
} from "@/hooks";
import { mapDetail } from "@/lib/record-mapper";
import { StatusPill } from "./StatusPill";

export function RecordDrawer({ recordId, onClose }: { recordId: string | null; onClose: () => void }) {
  const [tab, setTab] = useState<"data" | "history">("data");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const { data: detail, isLoading } = useRecord(recordId);
  const approve = useApproveRecord(recordId);
  const reject = useRejectRecord(recordId);
  const save = usePatchRecord(recordId);

  const record = detail ? mapDetail(detail) : null;
  const locked = detail?.locked_for_audit ?? false;

  useEffect(() => {
    setTab("data");
    setEdits({});
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recordId, onClose]);

  if (!recordId) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[760px] flex-col border-l border-border bg-surface shadow-elevated">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div className="min-w-0">
                {isLoading || !record ? (
                  <p className="text-muted-foreground">Loading…</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{record.id}</span>
                      <span>·</span>
                      <span>{record.source}</span>
                      <span>·</span>
                      <span>{record.scope}</span>
                    </div>
                    <h2 className="mt-1 truncate font-display text-lg font-medium">{record.activity}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusPill status={record.status} />
                      {locked && (
                        <span className="text-[11px] text-muted-foreground ring-1 ring-border rounded px-2 py-0.5">
                          Audit locked
                        </span>
                      )}
                      {record.validation && (
                        <span className="text-[11px] text-amber">{record.validation}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
              <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-surface-2" aria-label="Close">
                ×
              </button>
            </div>

            <div className="flex gap-1 border-b border-border px-6">
              {(["data", "history"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-3 py-2.5 text-[12.5px] capitalize ${tab === t ? "text-foreground border-b border-accent" : "text-muted-foreground"}`}
                >
                  {t === "data" ? "Raw vs normalized" : "Audit history"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {tab === "data" && record && (
                <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
                  <Panel title="Raw source" subtitle="Immutable">
                    <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 font-mono text-[11.5px]">
                      {JSON.stringify(record.raw, null, 2)}
                    </pre>
                  </Panel>
                  <Panel title="Normalized" subtitle={locked ? "Read-only" : "Editable"}>
                    <div className="space-y-2">
                      {Object.entries(record.normalized).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[120px_1fr] gap-2 items-center">
                          <label className="text-[11.5px] text-muted-foreground">{k}</label>
                          <input
                            disabled={locked}
                            defaultValue={String(v)}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [k]: e.target.value }))}
                            className="h-8 rounded-md border border-border bg-background px-2 font-mono text-[12px] disabled:opacity-60"
                          />
                        </div>
                      ))}
                    </div>
                    {!locked && Object.keys(edits).length > 0 && detail && (
                      <button
                        type="button"
                        onClick={() =>
                          save.mutate(
                            { detail, edits },
                            { onSuccess: () => setEdits({}) }
                          )
                        }
                        disabled={save.isPending}
                        className="mt-4 rounded-md bg-foreground px-3 py-1.5 text-[12px] text-primary-foreground"
                      >
                        Save changes
                      </button>
                    )}
                  </Panel>
                </div>
              )}
              {tab === "history" && detail && (
                <div className="p-6 space-y-4">
                  {detail.audit_history.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground">No audit entries yet.</p>
                  ) : (
                    detail.audit_history.map((e) => (
                      <div key={e.id} className="border-b border-border pb-3 text-[13px]">
                        <span className="text-muted-foreground">{e.actor}</span> changed{" "}
                        <span className="font-mono">{e.field}</span>
                        {e.before && (
                          <span className="ml-2 font-mono text-[11px]">
                            {e.before} → {e.after}
                          </span>
                        )}
                        <div className="text-[11px] text-muted-foreground">{e.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {record && !locked && (
              <div className="flex justify-between border-t border-border px-6 py-3.5">
                <button
                  type="button"
                  onClick={() => reject.mutate()}
                  disabled={reject.isPending}
                  className="rounded-md border border-border px-3 py-1.5 text-[12.5px]"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => approve.mutate()}
                  disabled={approve.isPending}
                  className="rounded-md bg-emerald/90 px-3 py-1.5 text-[12.5px] font-medium text-background"
                >
                  Approve & lock
                </button>
              </div>
            )}
      </aside>
    </>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface p-6">
      <div className="mb-3">
        <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-[11.5px] text-muted-foreground/80">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
