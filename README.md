# Baisoft Take-Home

This repository contains a full-stack **Product Marketplace** solution with:

- `glovomarket-pro/`: React + Vite + TypeScript frontend.
- `backend/`: Django + Django REST Framework backend.

## What I implemented (which parts)

### Backend
- JWT auth flow (`login`, `refresh`, `me`).
- Business-aware users and role-based access (`Admin`, `Editor`, `Approver`, `Viewer`).
- Product lifecycle workflow (`draft → pending_approval → approved`).
- Approval rules and permission checks for product actions.
- Public products endpoint for approved products only.
- User management API for business admins.
- Backend tests for auth/permission and product approval behavior.

### Frontend
- Public marketplace page for browsing products.
- Role-aware dashboard for product CRUD and workflow actions.
- User management screen for admins.
- Auth screens for login and admin signup.
- API service layer for auth/products integration.
- AI chat assistant widget.
- UX improvement: hover descriptions/tooltips (`title` + `aria-label`) on icon/action controls (approve, edit, delete, submit for approval, add product, and related icon actions).

## Setup instructions

### 1) Clone and enter project
```bash
git clone https://github.com/NagabaBlessing/Baisoft_Takehome.git
cd Baisoft_Takehome
```

### 2) Backend setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000` by default.

### 3) Frontend setup
Open a second terminal:
```bash
cd glovomarket-pro
npm install
cp .env.example .env
npm run dev
```
Frontend runs at `http://localhost:5173` by default.

## Tech decisions and assumptions

- **Django + DRF** chosen for fast, explicit RBAC and mature auth tooling.
- **JWT auth** used for stateless API consumption from the frontend.
- **Role-based UI + backend checks**: frontend hides unauthorized actions, backend enforces true permission boundaries.
- **Status-driven workflow** keeps approval logic explicit and auditable.
- **Service-layer frontend architecture** isolates API logic from presentational components.
- Assumes each authenticated user belongs to one business context for scoped product/user operations.

## Any known limitations

- No real checkout/order flow yet (`Add to Order` is demo behavior).
- AI assistant output quality depends on LLM response and prompt context as gemini template was used
- weak passwords are allowed
- There is no email/phone number verification for sign up

## Anything more to communicate

- Tried to use Glovo like features for inspiration hence the name on the UI

## How to run the project

### Option A: Local development (recommended)
1. Start backend from `backend/` with `python manage.py runserver`.
2. Start frontend from `glovomarket-pro/` with `npm run dev`.
3. Open `http://localhost:5173`.

### Option B: Docker Compose
From repository root:
```bash
docker compose up --build
```
(Use this if your local environment matches the compose expectations.)
