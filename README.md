# Baisoft Take-Home

This repository now contains:

- `glovomarket-pro/`: existing React/Vite frontend.
- `backend/`: new Django + DRF backend for the Product Marketplace assignment.

## Backend Features Implemented

- JWT authentication (`/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`)
- Business-aware users and roles (`Admin`, `Editor`, `Approver`, `Viewer`)
- Role-based permissions for:
  - user management
  - product management
  - product approval
- Product workflow with statuses: `draft`, `pending_approval`, `approved`
- Public product endpoint that only returns approved products
- DRF pagination and basic filtering (`business_id`, `max_price`)
- Django admin registrations for Business, User, Product
- API tests covering permission and approval behavior

## Quickstart (Backend)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Run tests:

```bash
python manage.py test
```

## API Overview

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `GET|POST|PATCH|DELETE /api/products/`
- `POST /api/products/{id}/approve/`
- `GET /api/public/products/`
- `GET|POST|PATCH|DELETE /api/users/`

## Notes

- Internal endpoints are scoped to the authenticated user's `business`.
- Only users with approval permission can approve products.
- Public endpoints expose approved products only.
