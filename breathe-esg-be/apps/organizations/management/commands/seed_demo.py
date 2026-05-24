from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.organizations.models import Organization, OrganizationMembership

User = get_user_model()

DEMO_ORG_NAME = "Breathe Demo Corp"
DEMO_USERNAME = "analyst"
DEMO_PASSWORD = "demo1234"


class Command(BaseCommand):
    help = "Seed demo organization and analyst user for local development."

    def handle(self, *args, **options):
        org, created_org = Organization.objects.get_or_create(name=DEMO_ORG_NAME)
        user, created_user = User.objects.get_or_create(
            username=DEMO_USERNAME,
            defaults={"email": "analyst@breathe.demo", "first_name": "Demo", "last_name": "Analyst"},
        )
        if created_user:
            user.set_password(DEMO_PASSWORD)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user '{DEMO_USERNAME}'"))

        OrganizationMembership.objects.get_or_create(organization=org, user=user)

        self.stdout.write(self.style.SUCCESS("Demo seed complete."))
        self.stdout.write(f"  Organization ID: {org.id}")
        self.stdout.write(f"  Organization:    {org.name}")
        self.stdout.write(f"  Username:        {DEMO_USERNAME}")
        self.stdout.write(f"  Password:        {DEMO_PASSWORD}")
        self.stdout.write("  Token: POST /api/auth/token/ with username + password")
