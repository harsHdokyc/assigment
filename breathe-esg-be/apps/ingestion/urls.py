from django.urls import path

from .views import UploadView
from .views_dashboard import DataSourceListView, GlobalAuditView, StatsView

urlpatterns = [
    path("uploads/", UploadView.as_view(), name="uploads"),
    path("datasources/", DataSourceListView.as_view(), name="datasources"),
    path("stats/", StatsView.as_view(), name="stats"),
    path("audit-log/", GlobalAuditView.as_view(), name="global-audit"),
]
