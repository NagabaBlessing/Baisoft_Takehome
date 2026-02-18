# Baisoft Take-Home

This repository now contains:

- `glovomarket-pro/`: existing React/Vite frontend.
- `backend/`: new Django + DRF backend for the Product Marketplace assignment.

## Code Structure

```text
Baisoft_Takehome/
├── backend/
│   ├── marketplace/                # Django project config (settings, urls, wsgi, asgi)
│   ├── apps/
│   │   ├── accounts/               # Business + User models, auth/user APIs, permissions
│   │   ├── products/               # Product model, workflow APIs, approval rules
│   │   └── core/                   # Shared app scaffold for future common modules
│   ├── manage.py
│   └── requirements.txt
├── glovomarket-pro/
│   ├── components/                 # Reusable UI blocks (navbar, cards, modal, chat)
│   ├── pages/                      # Route-level screens (dashboard, login, marketplace)
│   ├── services/                   # API/data service layer
│   ├── App.tsx / index.tsx         # App composition and bootstrapping
│   └── vite.config.ts
└── README.md
```

### Backend module responsibilities

- `apps/accounts`: Owns business-aware identity and role permissions.
- `apps/products`: Owns product lifecycle (`draft → pending_approval → approved`) and approval actions.
- `marketplace/urls.py`: Wires all API routes.

### Frontend module responsibilities

- `pages/`: Screen-level containers that compose feature behavior.
- `components/`: Presentational and reusable UI elements.
- `services/`: Data-fetching and business-logic helpers that isolate API access from UI.

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

## Suggested Next Steps

1. **Connect frontend services to Django API**
   - Point frontend auth/product service methods to `/api/*` endpoints.
   - Centralize token refresh and 401 retry behavior.
2. **Harden backend API surface**
   - Add stronger query filtering/search for products (name/category/order).
   - Add validation/error response standardization.
3. **Improve test coverage**
   - Add serializer and view tests for edge cases (cross-business access, invalid transitions).
   - Add frontend integration tests for login + product workflow.
4. **Operational readiness**
   - Add environment-based settings (`.env`) and CORS/CSRF deployment config.
   - Add Docker setup and CI workflow for lint + tests.
