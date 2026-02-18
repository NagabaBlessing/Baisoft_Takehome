from rest_framework.permissions import BasePermission


class IsBusinessUserManager(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.can_manage_users())
