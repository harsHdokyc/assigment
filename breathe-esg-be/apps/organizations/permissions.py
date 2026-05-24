from rest_framework.permissions import BasePermission


def get_user_organization_ids(user):
    if not user or not user.is_authenticated:
        return []
    return list(
        user.organization_memberships.values_list("organization_id", flat=True)
    )
