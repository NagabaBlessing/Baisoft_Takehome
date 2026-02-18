from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import Business, User, UserRole


class BusinessUserManagementTests(APITestCase):
    def setUp(self):
        self.business = Business.objects.create(name='Umbrella Corp')
        self.admin = User.objects.create_user(
            username='admin', password='password123', business=self.business, role=UserRole.ADMIN
        )
        self.viewer = User.objects.create_user(
            username='viewer', password='password123', business=self.business, role=UserRole.VIEWER
        )

    def authenticate(self, username: str):
        token_response = self.client.post(
            reverse('token_obtain_pair'), {'username': username, 'password': 'password123'}, format='json'
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_response.data['access']}")

    def test_admin_can_create_user(self):
        self.authenticate('admin')
        response = self.client.post(
            reverse('business-users-list'),
            {
                'username': 'new_editor',
                'email': 'editor@example.com',
                'password': 'password123',
                'role': UserRole.EDITOR,
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_viewer_cannot_create_user(self):
        self.authenticate('viewer')
        response = self.client.post(
            reverse('business-users-list'),
            {
                'username': 'new_user',
                'email': 'user@example.com',
                'password': 'password123',
                'role': UserRole.VIEWER,
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
