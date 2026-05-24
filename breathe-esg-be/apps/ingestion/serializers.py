from rest_framework import serializers

from .models import DataSource


class UploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    source_type = serializers.ChoiceField(choices=["sap", "utility", "travel"])
    organization_id = serializers.UUIDField()


class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = (
            "id",
            "source_type",
            "filename",
            "processing_status",
            "total_rows",
            "failed_count",
            "flagged_count",
            "uploaded_at",
        )
