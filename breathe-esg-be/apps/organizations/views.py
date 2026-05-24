from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Organization
from .permissions import get_user_organization_ids


class MeView(APIView):
    def get(self, request):
        org_ids = get_user_organization_ids(request.user)
        orgs = Organization.objects.filter(id__in=org_ids).values("id", "name")
        return Response(
            {
                "user": request.user.username,
                "name": request.user.get_full_name() or request.user.username,
                "organizations": list(orgs),
            }
        )
