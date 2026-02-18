from django.contrib.auth.models import AbstractUser
from django.db import models


class Business(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    EDITOR = 'editor', 'Editor'
    APPROVER = 'approver', 'Approver'
    VIEWER = 'viewer', 'Viewer'


ROLE_PERMISSIONS = {
    UserRole.ADMIN: {
        'manage_users': True,
        'manage_products': True,
        'approve_products': True,
    },
    UserRole.EDITOR: {
        'manage_users': False,
        'manage_products': True,
        'approve_products': False,
    },
    UserRole.APPROVER: {
        'manage_users': False,
        'manage_products': True,
        'approve_products': True,
    },
    UserRole.VIEWER: {
        'manage_users': False,
        'manage_products': False,
        'approve_products': False,
    },
}


class User(AbstractUser):
    business = models.ForeignKey(
        Business,
        related_name='users',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.VIEWER)

    @property
    def permissions_map(self) -> dict[str, bool]:
        return ROLE_PERMISSIONS.get(self.role, {})

    def can_manage_users(self) -> bool:
        return bool(self.permissions_map.get('manage_users', False))

    def can_manage_products(self) -> bool:
        return bool(self.permissions_map.get('manage_products', False))

    def can_approve_products(self) -> bool:
        return bool(self.permissions_map.get('approve_products', False))
