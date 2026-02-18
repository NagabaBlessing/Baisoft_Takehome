from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.views import BusinessUserViewSet, CurrentUserView
from apps.products.views import ProductViewSet, PublicProductListView

router = DefaultRouter()
router.register(r'users', BusinessUserViewSet, basename='business-users')
router.register(r'products', ProductViewSet, basename='products')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('api/public/products/', PublicProductListView.as_view(), name='public_products'),
    path('api/', include(router.urls)),
]
