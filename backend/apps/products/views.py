from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Product, ProductStatus
from .permissions import CanApproveProducts, CanManageProducts
from .serializers import ProductSerializer, PublicProductSerializer


class ProductFilterSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=ProductStatus.choices, required=False)
    search = serializers.CharField(required=False)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    ordering = serializers.ChoiceField(choices=['price', '-price', 'created_at', '-created_at'], required=False)

    def validate(self, attrs):
        min_price = attrs.get('min_price')
        max_price = attrs.get('max_price')
        if min_price is not None and max_price is not None and min_price > max_price:
            raise serializers.ValidationError({'max_price': 'max_price must be greater than or equal to min_price.'})
        return attrs


class PublicProductFilterSerializer(serializers.Serializer):
    business_id = serializers.IntegerField(required=False)
    search = serializers.CharField(required=False)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, CanManageProducts]

    def get_queryset(self):
        queryset = Product.objects.filter(business=self.request.user.business)
        serializer = ProductFilterSerializer(data=self.request.query_params)
        serializer.is_valid(raise_exception=True)
        filters = serializer.validated_data

        if filters.get('status'):
            queryset = queryset.filter(status=filters['status'])
        if filters.get('search'):
            queryset = queryset.filter(name__icontains=filters['search'])
        if filters.get('min_price') is not None:
            queryset = queryset.filter(price__gte=filters['min_price'])
        if filters.get('max_price') is not None:
            queryset = queryset.filter(price__lte=filters['max_price'])
        if filters.get('ordering'):
            queryset = queryset.order_by(filters['ordering'])

        return queryset

    def perform_create(self, serializer):
        serializer.save(business=self.request.user.business, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        approved_by = instance.approved_by
        if serializer.validated_data.get('status') != ProductStatus.APPROVED:
            approved_by = None
        serializer.save(approved_by=approved_by)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanApproveProducts])
    def approve(self, request, pk=None):
        product = self.get_object()
        if product.status != ProductStatus.PENDING_APPROVAL:
            return Response({'detail': 'Only pending products can be approved.'}, status=status.HTTP_400_BAD_REQUEST)
        product.status = ProductStatus.APPROVED
        product.approved_by = request.user
        product.save(update_fields=['status', 'approved_by', 'updated_at'])
        return Response(self.get_serializer(product).data, status=status.HTTP_200_OK)


class PublicProductListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PublicProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(status=ProductStatus.APPROVED)

        serializer = PublicProductFilterSerializer(data=self.request.query_params)
        serializer.is_valid(raise_exception=True)
        filters = serializer.validated_data

        if filters.get('business_id'):
            queryset = queryset.filter(business_id=filters['business_id'])
        if filters.get('search'):
            queryset = queryset.filter(name__icontains=filters['search'])
        if filters.get('max_price') is not None:
            queryset = queryset.filter(price__lte=filters['max_price'])

        return queryset
