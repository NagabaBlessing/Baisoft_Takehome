from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Product, ProductStatus
from .permissions import CanApproveProducts, CanManageProducts
from .serializers import ProductSerializer, PublicProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, CanManageProducts]

    def get_queryset(self):
        return Product.objects.filter(business=self.request.user.business)

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
        product.status = ProductStatus.APPROVED
        product.approved_by = request.user
        product.save(update_fields=['status', 'approved_by', 'updated_at'])
        return Response(self.get_serializer(product).data, status=status.HTTP_200_OK)


class PublicProductListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PublicProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(status=ProductStatus.APPROVED)
        business_id = self.request.query_params.get('business_id')
        max_price = self.request.query_params.get('max_price')

        if business_id:
            queryset = queryset.filter(business_id=business_id)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset
