from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.audit.models import AuditLog
from apps.organizations.permissions import get_user_organization_ids
from apps.records.display import record_display_ref
from apps.records.models import NormalizedEmissionRecord, RecordStatus

from .models import DataSource
from .serializers import DataSourceSerializer


class StatsView(APIView):
    def get(self, request):
        org_ids = get_user_organization_ids(request.user)
        qs = NormalizedEmissionRecord.objects.filter(organization_id__in=org_ids)
        counts = qs.values("status").annotate(c=Count("id"))
        by_status = {row["status"]: row["c"] for row in counts}
        total_rows = DataSource.objects.filter(organization_id__in=org_ids).values_list(
            "total_rows", flat=True
        )
        return Response(
            {
                "pending": by_status.get(RecordStatus.PENDING, 0),
                "flagged": by_status.get(RecordStatus.FLAGGED, 0),
                "failed": by_status.get(RecordStatus.FAILED, 0),
                "approved": by_status.get(RecordStatus.APPROVED, 0),
                "rejected": by_status.get(RecordStatus.REJECTED, 0),
                "total_records": qs.count(),
                "total_uploaded_rows": sum(total_rows),
            }
        )


class DataSourceListView(APIView):
    def get(self, request):
        org_ids = get_user_organization_ids(request.user)
        sources = DataSource.objects.filter(organization_id__in=org_ids).select_related(
            "uploaded_by"
        )[:20]
        data = []
        for ds in sources:
            item = DataSourceSerializer(ds).data
            item["uploaded_by"] = (
                ds.uploaded_by.get_full_name() or ds.uploaded_by.username
                if ds.uploaded_by
                else ""
            )
            data.append(item)
        return Response(data)


class GlobalAuditView(APIView):
    def get(self, request):
        org_ids = get_user_organization_ids(request.user)
        logs = (
            AuditLog.objects.filter(record__organization_id__in=org_ids)
            .select_related("changed_by", "record", "record__datasource", "record__raw_record")
            .order_by("-changed_at")[:100]
        )
        return Response(
            [
                {
                    "id": str(log.id),
                    "actor": (log.changed_by.get_full_name() or log.changed_by.username)
                    if log.changed_by
                    else "system",
                    "action": f"Changed {log.field_name}",
                    "target": record_display_ref(log.record),
                    "record_id": str(log.record_id),
                    "field": log.field_name,
                    "before": log.old_value,
                    "after": log.new_value,
                    "timestamp": log.changed_at.strftime("%Y-%m-%d %H:%M:%S"),
                }
                for log in logs
            ]
        )
