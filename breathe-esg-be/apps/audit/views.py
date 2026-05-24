from rest_framework.response import Response
from rest_framework.views import APIView

from apps.organizations.permissions import get_user_organization_ids
from apps.records.models import NormalizedEmissionRecord

from .models import AuditLog


class AuditLogView(APIView):
    def get(self, request, record_id):
        org_ids = get_user_organization_ids(request.user)
        record = NormalizedEmissionRecord.objects.filter(
            id=record_id, organization_id__in=org_ids
        ).first()
        if not record:
            return Response({"detail": "Not found."}, status=404)

        logs = AuditLog.objects.filter(record=record).select_related("changed_by")
        data = [
            {
                "id": str(log.id),
                "field_name": log.field_name,
                "old_value": log.old_value,
                "new_value": log.new_value,
                "changed_by": (log.changed_by.get_full_name() or log.changed_by.username)
                if log.changed_by
                else "system",
                "changed_at": log.changed_at.isoformat(),
            }
            for log in logs
        ]
        return Response(data)
