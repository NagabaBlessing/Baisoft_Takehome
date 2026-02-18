from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Business, User


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)


@admin.register(User)
class MarketplaceUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Marketplace', {'fields': ('business', 'role')}),
    )
    list_display = ('id', 'username', 'email', 'role', 'business', 'is_staff')
    list_filter = ('role', 'business', 'is_staff')
