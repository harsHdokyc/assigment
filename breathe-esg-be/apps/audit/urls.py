from django.urls import path

from .views import AuditLogView

urlpatterns = [
    path("audit/<uuid:record_id>/", AuditLogView.as_view(), name="audit-log"),
]
