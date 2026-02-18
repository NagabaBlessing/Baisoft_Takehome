from rest_framework import serializers

from .models import Product, ProductStatus


class ProductSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    approved_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'image_url',
            'price',
            'status',
            'created_by',
            'approved_by',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'approved_by', 'created_at', 'updated_at']

    def validate_status(self, value):
        if value not in ProductStatus.values:
            raise serializers.ValidationError('Invalid product status.')
        return value


class PublicProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'image_url', 'price', 'status']
