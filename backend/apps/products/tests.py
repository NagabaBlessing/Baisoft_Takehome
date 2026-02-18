from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import Business, User, UserRole
from apps.products.models import Product, ProductStatus


class ProductWorkflowTests(APITestCase):
    def setUp(self):
        self.business = Business.objects.create(name='Acme Inc')
        self.editor = User.objects.create_user(
            username='editor',
            password='password123',
            business=self.business,
            role=UserRole.EDITOR,
        )
        self.approver = User.objects.create_user(
            username='approver',
            password='password123',
            business=self.business,
            role=UserRole.APPROVER,
        )

    def authenticate(self, username: str, password: str):
        response = self.client.post(reverse('token_obtain_pair'), {'username': username, 'password': password})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_editor_can_create_but_not_approve(self):
        self.authenticate('editor', 'password123')
        create_response = self.client.post(
            reverse('products-list'),
            {
                'name': 'Keyboard',
                'description': 'Mechanical keyboard',
                'price': '49.99',
                'status': ProductStatus.PENDING_APPROVAL,
            },
            format='json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        approve_response = self.client.post(reverse('products-approve', args=[create_response.data['id']]))
        self.assertEqual(approve_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_approver_can_approve_and_public_list_only_shows_approved(self):
        product = Product.objects.create(
            business=self.business,
            created_by=self.editor,
            name='Mouse',
            description='Wireless mouse',
            price=Decimal('19.99'),
            status=ProductStatus.PENDING_APPROVAL,
        )

        self.authenticate('approver', 'password123')
        approve_response = self.client.post(reverse('products-approve', args=[product.id]))
        self.assertEqual(approve_response.status_code, status.HTTP_200_OK)

        public_response = self.client.get(reverse('public_products'))
        self.assertEqual(public_response.status_code, status.HTTP_200_OK)
        self.assertEqual(public_response.data['results'][0]['status'], ProductStatus.APPROVED)
