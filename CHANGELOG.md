# Changelog — SPMS

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.1] - 2026-11-01 — Security Remediation & Hardening

### Security
- **Credential Rotation & Configuration Hardening**:
  - Removed all hardcoded database connection credentials and JWT signing secret defaults from `config.py`.
  - Refactored `Settings` using modern Pydantic Settings with strict validation for `MONGODB_URL` and `SECRET_KEY` (minimum 32 characters, rejection of legacy compromised keys).
  - Sanitized `backend/.env.example` with non-sensitive template placeholders.
  - Enforced `.env` exclusion across `.gitignore`.
- **CORS Vulnerability Remediation**:
  - Eliminated wildcard `*` from `BACKEND_CORS_ORIGINS`.
  - Configured explicit frontend development origins (`http://localhost:5173`, `http://127.0.0.1:5173`) and automated origin validation.
- **Sensitive Logging & Database Lifecycle**:
  - Implemented `sanitize_mongo_uri()` to mask credentials in connection log outputs.
  - Removed silent fallback to `mongodb://localhost:27017`; database connections fail safely with sanitized diagnostics.
  - Restricted demo data seeding strictly to development environments (`ENABLE_DEMO_SEEDING` enforcement).
- **Git History Sanitization**:
  - Executed `git-filter-repo` across repository history, replacing compromised credentials in historical commits with `[REDACTED_SECRET]`.
  - Scanned rewritten Git history with Gitleaks v8.18.2 (0 leaks found).
- **Preventative CI Secret Scanning**:
  - Added `.github/workflows/security.yml` featuring automated Gitleaks secret detection and `.env` tracking prevention.
  - Added project `.gitleaksignore` for false-positive management.

---

## [1.0.0] - 2026-11-01

### Added
- **Watermelon UI Enterprise Redesign**:
  - Implemented cohesive university SaaS aesthetic with Deep Navy institucional palette.
  - Reusable `AppShell` with role-aware collapsible sidebar, global breadcrumbs, notification panel, and user profile drawer.
  - Four dedicated portals: Student Portal, Placement Officer Portal, Recruiter Portal, and Administrator Portal.
  - Interactive multi-step `CreateDriveWizard` with dynamic allowed branches, CGPA boundaries, and recruitment rounds (React Hook Form + Zod).
  - Corporate Partner Directory (`CompanyModal`) and Candidate Review Drawer (`CandidateDetailsDrawer`).
  - Watermelon UI design tokens & primitives: `Badge`, `Button`, `Card`, `Modal`, `EmptyState`, `Skeleton`, `Toast`.
- **Database Architecture & PyMongo Native Async API**:
  - Migrated database layer from deprecated Motor driver to native `pymongo.AsyncMongoClient` with `ServerApi`.
  - Added enterprise connection manager with ping diagnostics, timeout protection, and seamless local fallback.
  - Configured MongoDB Atlas cloud database support (`spms-cluster`).
  - Added full corporate partner collection and CRUD endpoints (`/api/v1/companies`).
- **Comprehensive Quality Assurance & Automated Testing**:
  - Added 32 backend test cases across `tests/unit` and `tests/integration` with 100% pass rate.
  - Configured `pytest-cov` reporting test coverage across core engines.
  - Added frontend test suite using `vitest`, `@testing-library/react`, and `@testing-library/jest-dom`.
  - Integrated `ruff` linting and code quality validation in `pyproject.toml`.
- **DevOps, Docker & GitHub Actions CI/CD**:
  - Added production `backend/Dockerfile` with non-root security user and native healthcheck.
  - Added multi-stage `frontend/Dockerfile` with Nginx SPA routing and reverse proxy.
  - Added `docker-compose.yml` orchestrating backend and frontend services.
  - Created `.github/workflows/ci.yml` running automated linting, test suites, coverage, and Docker build validation.

### Removed
- Deprecated `motor` library completely removed from dependencies.

