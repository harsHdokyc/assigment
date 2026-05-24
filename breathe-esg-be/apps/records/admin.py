from django.contrib import admin

from .models import NormalizedEmissionRecord


@admin.register(NormalizedEmissionRecord)
class NormalizedEmissionRecordAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "activity_label",
        "scope",
        "status",
        "locked_for_audit",
        "organization",
    )
    list_filter = ("status", "scope", "locked_for_audit")
