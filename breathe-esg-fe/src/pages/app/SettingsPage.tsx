import { PageTitle } from "@/components/PageTitle";
import { PageHeader } from "@/components/app/PageHeader";
import { useMe } from "@/hooks";

export default function SettingsPage() {
  const { data: me, isLoading, isError } = useMe();
  const org = me?.organizations[0];

  return (
    <>
      <PageTitle title="Settings — Breathe ESG" />
      <div className="space-y-7">
        <PageHeader
          eyebrow="Workspace"
          title="Settings"
          description="Organization context from your signed-in account."
        />

        {isError && <p className="text-[13px] text-rose">Could not load account details.</p>}

        <section className="rounded-xl border border-border bg-surface p-6 max-w-xl">
          <h2 className="font-display text-base font-medium text-foreground">Organization</h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            Used for multi-tenant scoping on uploads and records.
          </p>
          <dl className="mt-5 space-y-4 text-[13px]">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Signed in as</dt>
              <dd className="mt-1 text-foreground">{isLoading ? "…" : me?.name ?? me?.user}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Organization</dt>
              <dd className="mt-1 text-foreground">{isLoading ? "…" : org?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Organization ID</dt>
              <dd className="mt-1 font-mono text-[12px] text-muted-foreground break-all">
                {isLoading ? "…" : org?.id ?? "—"}
              </dd>
            </div>
          </dl>
        </section>

        <p className="text-[12.5px] text-muted-foreground max-w-xl">
          Additional workspace settings (reviewer roles, emission factor catalogs, API keys) are out of scope
          for this prototype.
        </p>
      </div>
    </>
  );
}
