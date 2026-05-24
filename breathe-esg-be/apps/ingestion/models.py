import uuid

from django.conf import settings
from django.db import models

from apps.organizations.models import Organization


class SourceType(models.TextChoices):
    SAP = "sap", "SAP Export"
    UTILITY = "utility", "Utility CSV"
    TRAVEL = "travel", "Travel Data"


class ProcessingStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PROCESSING = "processing", "Processing"
    COMPLETED = "completed", "Completed"
    FAILED = "failed", "Failed"


class DataSource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="data_sources"
    )
    source_type = models.CharField(max_length=20, choices=SourceType.choices)
    ingestion_method = models.CharField(max_length=50, default="csv_upload")
    filename = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="uploads",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processing_status = models.CharField(
        max_length=20,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.PENDING,
    )
    total_rows = models.PositiveIntegerField(default=0)
    failed_count = models.PositiveIntegerField(default=0)
    flagged_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-uploaded_at"]
        indexes = [
            models.Index(fields=["organization", "-uploaded_at"]),
        ]

    def __str__(self):
        return f"{self.filename} ({self.source_type})"


class RawRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    datasource = models.ForeignKey(
        DataSource, on_delete=models.CASCADE, related_name="raw_records"
    )
    row_number = models.PositiveIntegerField()
    raw_payload = models.JSONField()
    processing_status = models.CharField(max_length=20, default="pending")
    error_message = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["row_number"]
        indexes = [
            models.Index(fields=["datasource", "row_number"]),
        ]

    def __str__(self):
        return f"Row {self.row_number} of {self.datasource_id}"
