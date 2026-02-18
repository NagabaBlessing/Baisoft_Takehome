# Marketplace Backend (Django + DRF)

## What is implemented

- JWT auth with SimpleJWT
- Custom user model linked to `Business`
- Role-based permissions (`Admin`, `Editor`, `Approver`, `Viewer`)
- Product CRUD with approval flow
- Public endpoint exposing approved products only
- Pagination + simple filters (`business_id`, `max_price`)
- Basic tests for permissions and approval workflow

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Important endpoints

- `POST /api/auth/login/`
- `GET /api/auth/me/`
- `GET|POST /api/products/`
- `POST /api/products/{id}/approve/`
- `GET /api/public/products/`
- `GET|POST /api/users/`
