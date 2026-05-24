from django.conf import settings
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.organizations.models import Organization
from apps.organizations.permissions import get_user_organization_ids

from .models import DataSource, ProcessingStatus
from .serializers import UploadSerializer
from .services import UploadParseError, parse_csv_to_raw_records


class UploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        org_id = serializer.validated_data["organization_id"]
        if org_id not in get_user_organization_ids(request.user):
            return Response({"detail": "Organization not found."}, status=status.HTTP_403_FORBIDDEN)

        organization = Organization.objects.get(id=org_id)
        uploaded_file = serializer.validated_data["file"]
        source_type = serializer.validated_data["source_type"]

        if not uploaded_file.name.lower().endswith(".csv"):
            return Response({"detail": "Only CSV files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

        if uploaded_file.size > settings.MAX_UPLOAD_BYTES:
            return Response({"detail": "File too large."}, status=status.HTTP_400_BAD_REQUEST)

        file_bytes = uploaded_file.read()
        if not file_bytes.strip():
            return Response({"detail": "Empty file."}, status=status.HTTP_400_BAD_REQUEST)

        datasource = DataSource.objects.create(
            organization=organization,
            source_type=source_type,
            filename=uploaded_file.name,
            uploaded_by=request.user,
            processing_status=ProcessingStatus.PENDING,
        )

        try:
            summary = parse_csv_to_raw_records(datasource, file_bytes)
        except UploadParseError as exc:
            return Response({"detail": exc.message}, status=status.HTTP_400_BAD_REQUEST)

        return Response(summary, status=status.HTTP_201_CREATED)
