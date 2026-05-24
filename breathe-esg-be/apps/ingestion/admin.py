from django.contrib import admin

from .models import DataSource, RawRecord


class RawRecordInline(admin.TabularInline):
    model = RawRecord
    extra = 0
    readonly_fields = ("row_number", "raw_payload", "processing_status")


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = (
        "filename",
        "source_type",
        "organization",
        "processing_status",
        "total_rows",
        "uploaded_at",
    )
    list_filter = ("source_type", "processing_status")
    inlines = [RawRecordInline]


@admin.register(RawRecord)
class RawRecordAdmin(admin.ModelAdmin):
    list_display = ("datasource", "row_number", "processing_status")
