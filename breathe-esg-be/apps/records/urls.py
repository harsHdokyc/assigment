from django.urls import path

from .views import RecordApproveView, RecordDetailView, RecordListView, RecordRejectView

urlpatterns = [
    path("records/", RecordListView.as_view(), name="record-list"),
    path("records/<uuid:pk>/", RecordDetailView.as_view(), name="record-detail"),
    path("records/<uuid:pk>/approve/", RecordApproveView.as_view(), name="record-approve"),
    path("records/<uuid:pk>/reject/", RecordRejectView.as_view(), name="record-reject"),
]
