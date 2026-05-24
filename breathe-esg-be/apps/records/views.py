from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.audit.models import AuditLog
from apps.organizations.permissions import get_user_organization_ids

from .models import NormalizedEmissionRecord, RecordStatus
from .serializers import (
    RecordDetailSerializer,
    RecordListSerializer,
    RecordPatchSerializer,
)


def org_scoped_records(user):
    org_ids = get_user_organization_ids(user)
    return NormalizedEmissionRecord.objects.filter(organization_id__in=org_ids).select_related(
        "datasource", "raw_record", "reviewed_by"
    )


class RecordListView(ListAPIView):
    serializer_class = RecordListSerializer

    def get_queryset(self):
        qs = org_scoped_records(self.request.user)
        params = self.request.query_params

        if status_val := params.get("status"):
            qs = qs.filter(status=status_val.lower())
        if source_type := params.get("source_type"):
            qs = qs.filter(datasource__source_type=source_type.lower())
        if scope := params.get("scope"):
            qs = qs.filter(scope=int(scope))
        return qs.order_by("-updated_at")


class RecordDetailView(RetrieveUpdateAPIView):
    serializer_class = RecordDetailSerializer
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        return org_scoped_records(self.request.user)

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return RecordPatchSerializer
        return RecordDetailSerializer

    def partial_update(self, request, *args, **kwargs):
        record = self.get_object()
        if record.locked_for_audit:
            return Response(
                {"detail": "Record is locked for audit."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = RecordPatchSerializer(record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for field, new_val in serializer.validated_data.items():
            old_val = getattr(record, field)
            old_str = "" if old_val is None else str(old_val)
            new_str = "" if new_val is None else str(new_val)
            if old_str != new_str:
                AuditLog.objects.create(
                    record=record,
                    field_name=field,
                    old_value=old_str,
                    new_value=new_str,
                    changed_by=request.user,
                )
                setattr(record, field, new_val)

        record.save(update_fields=list(serializer.validated_data.keys()) + ["updated_at"])
        return Response(RecordDetailSerializer(record).data)


class RecordApproveView(APIView):
    def post(self, request, pk):
        record = org_scoped_records(request.user).filter(pk=pk).first()
        if not record:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if record.locked_for_audit:
            return Response({"detail": "Already locked."}, status=status.HTTP_400_BAD_REQUEST)

        old_status = record.status
        record.status = RecordStatus.APPROVED
        record.locked_for_audit = True
        record.reviewed_by = request.user
        record.reviewed_at = timezone.now()
        record.save()

        AuditLog.objects.create(
            record=record,
            field_name="status",
            old_value=old_status,
            new_value=RecordStatus.APPROVED,
            changed_by=request.user,
        )
        return Response(RecordDetailSerializer(record).data)


class RecordRejectView(APIView):
    def post(self, request, pk):
        record = org_scoped_records(request.user).filter(pk=pk).first()
        if not record:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if record.locked_for_audit:
            return Response({"detail": "Record is locked."}, status=status.HTTP_403_FORBIDDEN)

        old_status = record.status
        record.status = RecordStatus.REJECTED
        record.reviewed_by = request.user
        record.reviewed_at = timezone.now()
        record.save()

        AuditLog.objects.create(
            record=record,
            field_name="status",
            old_value=old_status,
            new_value=RecordStatus.REJECTED,
            changed_by=request.user,
        )
        return Response(RecordDetailSerializer(record).data)
