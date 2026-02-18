from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'business', 'status', 'price', 'created_by', 'approved_by')
    list_filter = ('status', 'business')
    search_fields = ('name', 'description')
