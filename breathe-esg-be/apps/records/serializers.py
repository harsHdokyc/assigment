from rest_framework import serializers

from apps.ingestion.models import SourceType

from .models import NormalizedEmissionRecord, RecordStatus

EDITABLE_FIELDS = {
    "category",
    "activity_date",
    "activity_label",
    "activity_value",
    "activity_unit",
    "normalized_value",
    "normalized_unit",
    "emission_factor",
    "calculated_emissions",
    "facility",
    "vendor",
    "employee",
    "extra_normalized",
}


class RecordListSerializer(serializers.ModelSerializer):
    source_type = serializers.CharField(source="datasource.source_type", read_only=True)
    source_label = serializers.SerializerMethodField()
    scope_label = serializers.SerializerMethodField()
    validation_summary = serializers.SerializerMethodField()
    reviewer = serializers.SerializerMethodField()

    class Meta:
        model = NormalizedEmissionRecord
        fields = (
            "id",
            "source_type",
            "source_label",
            "scope",
            "scope_label",
            "activity_label",
            "normalized_value",
            "normalized_unit",
            "status",
            "validation_summary",
            "reviewer",
            "updated_at",
        )

    def get_source_label(self, obj):
        return SourceType(obj.datasource.source_type).label

    def get_scope_label(self, obj):
        return f"Scope {obj.scope}" if obj.scope else ""

    def get_validation_summary(self, obj):
        if not obj.validation_issues:
            return None
        first = obj.validation_issues[0]
        return first.get("message") if isinstance(first, dict) else str(first)

    def get_reviewer(self, obj):
        if obj.reviewed_by:
            return obj.reviewed_by.get_full_name() or obj.reviewed_by.username
        return ""


class RecordDetailSerializer(RecordListSerializer):
    raw = serializers.SerializerMethodField()
    normalized = serializers.SerializerMethodField()
    audit_history = serializers.SerializerMethodField()
    locked_for_audit = serializers.BooleanField()

    class Meta(RecordListSerializer.Meta):
        fields = RecordListSerializer.Meta.fields + (
            "raw",
            "normalized",
            "validation_issues",
            "audit_history",
            "locked_for_audit",
            "activity_value",
            "activity_unit",
            "emission_factor",
            "calculated_emissions",
            "facility",
            "vendor",
            "employee",
            "category",
            "activity_date",
            "extra_normalized",
            "created_at",
        )

    def get_raw(self, obj):
        return obj.raw_record.raw_payload

    def get_normalized(self, obj):
        data = dict(obj.extra_normalized or {})
        if obj.scope is not None:
            data["scope"] = obj.scope
        if obj.activity_label:
            data["activity"] = obj.activity_label
        if obj.normalized_value is not None:
            data["value"] = float(obj.normalized_value)
        if obj.normalized_unit:
            data["unit"] = obj.normalized_unit
        if obj.emission_factor is not None:
            data["emission_factor"] = float(obj.emission_factor)
        if obj.calculated_emissions is not None:
            data["co2e_kg"] = float(obj.calculated_emissions)
        if obj.facility:
            data["facility"] = obj.facility
        return data

    def get_audit_history(self, obj):
        logs = obj.audit_logs.select_related("changed_by").all()[:50]
        return [
            {
                "id": str(log.id),
                "field": log.field_name,
                "before": log.old_value,
                "after": log.new_value,
                "actor": (log.changed_by.get_full_name() or log.changed_by.username)
                if log.changed_by
                else "system",
                "timestamp": log.changed_at.isoformat(),
            }
            for log in logs
        ]


class RecordPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedEmissionRecord
        fields = tuple(EDITABLE_FIELDS)
