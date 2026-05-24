from django.core.management.base import BaseCommand

from apps.ingestion.models import DataSource
from apps.normalization.pipeline import process_datasource


class Command(BaseCommand):
    help = "Re-run normalization + validation for all datasources (e.g. after pipeline upgrade)."

    def handle(self, *args, **options):
        for ds in DataSource.objects.all():
            stats = process_datasource(ds)
            self.stdout.write(f"{ds.filename}: {stats}")
