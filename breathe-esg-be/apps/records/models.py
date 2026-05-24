import uuid

from django.conf import settings
from django.db import models

from apps.ingestion.models import DataSource, RawRecord
from apps.organizations.models import Organization


class RecordStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    FLAGGED = "flagged", "Flagged"
    FAILED = "failed", "Failed"
    APPROVED = "approved", "Approved"
    REJECTED = "rejected", "Rejected"


class NormalizedEmissionRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="emission_records"
    )
    raw_record = models.OneToOneField(
        RawRecord, on_delete=models.CASCADE, related_name="normalized_record"
    )
    datasource = models.ForeignKey(
        DataSource,
        on_delete=models.CASCADE,
        related_name="normalized_records",
    )

    category = models.CharField(max_length=100, blank=True, default="")
    scope = models.PositiveSmallIntegerField(null=True, blank=True)
    activity_date = models.DateField(null=True, blank=True)
    activity_label = models.CharField(max_length=255, blank=True, default="")

    activity_value = models.DecimalField(max_digits=18, decimal_places=4, null=True, blank=True)
    activity_unit = models.CharField(max_length=50, blank=True, default="")

    normalized_value = models.DecimalField(max_digits=18, decimal_places=4, null=True, blank=True)
    normalized_unit = models.CharField(max_length=50, blank=True, default="")

    emission_factor = models.DecimalField(max_digits=12, decimal_places=6, null=True, blank=True)
    calculated_emissions = models.DecimalField(max_digits=18, decimal_places=4, null=True, blank=True)

    facility = models.CharField(max_length=255, blank=True, default="")
    vendor = models.CharField(max_length=255, blank=True, default="")
    employee = models.CharField(max_length=255, blank=True, default="")

    # Flexible store for source-specific normalized fields (matches frontend JSON view)
    extra_normalized = models.JSONField(default=dict, blank=True)
    validation_issues = models.JSONField(default=list, blank=True)

    status = models.CharField(
        max_length=20, choices=RecordStatus.choices, default=RecordStatus.PENDING
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_records",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    locked_for_audit = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["datasource"]),
            models.Index(fields=["raw_record"]),
        ]

    def __str__(self):
        return f"{self.activity_label or self.id} [{self.status}]"
