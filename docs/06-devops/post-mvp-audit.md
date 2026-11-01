# Full-Stack Engineering Audit — SPMS Post-MVP

**Project**: Student Placement Management System (SPMS)  
**Institution**: KIET Group of Institutions  
**Date**: 2026-11-01  
**Auditor**: Senior Full-Stack Engineering Team  

---

## 1. Executive Summary

The initial MVP sprint successfully delivered a functioning prototype demonstrating core eligibility verification, student application submission, and basic TPO pipeline operations. However, this engineering audit identifies critical architectural, security, and interface deficiencies that must be addressed to elevate the system to an enterprise-grade academic placement platform:

1. **Database Layer**: The backend currently relies on `motor`, which MongoDB officially deprecated in May 2026. The database driver must be migrated to the modern **PyMongo Async API** (`AsyncMongoClient` / `AsyncDatabase`).
2. **Cloud Database (MongoDB Atlas)**: The Atlas connection string is configured in `.env`, but connection attempts encounter TLS handshake alerts (SSL alert 80) until client IP addresses (`103.115.125.168` or `0.0.0.0/0`) are whitelisted in the MongoDB Atlas Console Network Access list.
3. **Role Architecture**: Roles are inconsistently defined across endpoints (`tpo` vs `PLACEMENT_OFFICER`, `student` vs `STUDENT`). Canonical enumeration must be standardized with backward compatibility.
4. **Portal Coverage**: The existing frontend only implements Student and basic TPO views. Dedicated, feature-rich portals for **Recruiters** and **System Administrators** are missing.
5. **UI Architecture**: The UI needs a comprehensive design overhaul using **Watermelon UI** design patterns, incorporating a persistent responsive application shell, collapsible navigation, accessible data tables, and rich analytics charts.
6. **Testing & CI/CD**: Only the eligibility engine has unit test coverage. Complete end-to-end integration testing, frontend Vitest tests, Docker multi-stage containerization, and GitHub Actions CI pipelines are pending.

---

## 2. Component-by-Component Audit

### 2.1 Backend Architecture & API

| Component | Current State | Deficiencies & Findings | Corrective Action |
| :--- | :--- | :--- | :--- |
| **Driver & Async IO** | Motor 3.7.1 (`AsyncIOMotorClient`) | Motor is deprecated. Async cursor operations should use native PyMongo async primitives. | Migrate to `pymongo.AsyncMongoClient` and `pymongo.asynchronous.database.AsyncDatabase`. Remove `motor` from dependencies. |
| **Authentication & RBAC** | Argon2 + PyJWT implemented | Public `/auth/register` accepts arbitrary role parameter from the client. | Restrict public registration strictly to `STUDENT`. Privileged roles (`PLACEMENT_OFFICER`, `RECRUITER`, `ADMIN`) must require administrative creation. |
| **Role Normalization** | Mixed case strings (`"student"`, `"tpo"`, `"recruiter"`) | No canonical role enum; mismatch with academic specification (`PLACEMENT_OFFICER`). | Establish `AppRole` enum (`STUDENT`, `PLACEMENT_OFFICER`, `RECRUITER`, `ADMIN`) with normalization middleware for legacy aliases (`tpo` -> `PLACEMENT_OFFICER`). |
| **Company Management** | Drive-embedded company strings | No standalone `/companies/` CRUD endpoints for company directory, tier classifications, and contact management. | Implement dedicated `/companies` API router with industry, website, tier, and contact details. |
| **Recruiter Permissions** | Basic role check only | Recruiters could query candidates from other companies' private rounds. | Enforce multi-tenant company isolation: recruiters can only view applicants and drives associated with their company. |
| **Application State Machine** | Linear status updates | Status transitions lack strict state machine validation (e.g. cannot jump from Applied to Offered without intermediate stage record). | Implement formal status transition validator with audit logs. |

### 2.2 Database & Data Model

| Entity | Current Schema | Findings | Recommendation |
| :--- | :--- | :--- | :--- |
| **Users** | `users` collection with email index | Password hash stored securely with Argon2id. Role string needs canonical validation. | Add canonical role validator and account activation flag. |
| **Students** | `students` collection with roll/user index | Good academic metrics (CGPA, 10th, 12th, backlogs, skills). | Add profile verification status (`verified_by_tpo: bool`). |
| **Companies** | Not isolated | Currently created inline within drives. | Create dedicated `companies` collection with unique company name index and recruiter mappings. |
| **Drives** | Comprehensive criteria | Strong automated eligibility criteria. | Add recruiter association and application capacity caps. |
| **Applications** | Compound index `(drive_id, student_id)` | Round history is tracked cleanly. | Add formal offer letter metadata and feedback comments. |

### 2.3 Frontend & UI/UX

| View / Portal | Current Status | Issues Identified | Planned Redesign (Watermelon UI) |
| :--- | :--- | :--- | :--- |
| **App Shell** | Single top navbar with tab switching | Lacks enterprise navigation, sidebar, breadcrumbs, user drawer, and global notifications. | Build modern SaaS Shell with collapsible sidebar, institution badge, role switcher, and command palette. |
| **Student Portal** | Basic 2-tab view | Good metrics and eligibility badges, but lacks detailed profile completion progress, interview schedule, and offer acceptance workflows. | Redesign with Watermelon SaaS layout, application timeline drawer, and interactive profile editor. |
| **TPO Dashboard** | Functional table & modal | Good KPI cards, but lacks interactive company manager, student verification queue, and multi-step drive creation wizard. | Implement multi-step React Hook Form + Zod drive wizard, advanced applicant table with search/filters/drawer. |
| **Recruiter Portal** | Missing dedicated view | Recruiters currently see TPO view or raw API. | Build dedicated Recruiter experience: assigned job drives, applicant shortlisting, and candidate evaluation form. |
| **Admin Portal** | Missing dedicated view | No user activation/deactivation, audit logs, or department management. | Build clean System Administration interface with user management and audit log table. |

### 2.4 DevOps & Quality Assurance

| Area | Status | Gaps | Planned Action |
| :--- | :--- | :--- | :--- |
| **Unit Testing** | 4 tests passing in `test_eligibility.py` | Coverage limited to eligibility function (~15% of codebase). | Write unit and integration tests for Auth, RBAC, Companies, Drives, Applications, and Analytics (target: >85% coverage). |
| **Frontend Tests** | None | No Vitest or React Testing Library configuration. | Configure Vitest and write component tests for auth, dashboard cards, and eligibility badges. |
| **Docker** | Skeleton only | No working multi-stage Dockerfiles or compose configuration. | Create production-grade Dockerfile for FastAPI (Python 3.10-slim), Dockerfile for Vite/Nginx, and `docker-compose.yml`. |
| **CI Pipeline** | None | No `.github/workflows/ci.yml`. | Build complete GitHub Actions workflow covering linting (Ruff), backend tests (pytest), frontend build, and Docker builds. |

---

## 3. Immediate Action Plan

1. **Step 1**: Migrate backend database layer from `motor` to native **PyMongo Async API** (`AsyncMongoClient`), removing Motor from `requirements.txt`.
2. **Step 2**: Implement canonical role normalization (`STUDENT`, `PLACEMENT_OFFICER`, `RECRUITER`, `ADMIN`) and secure public registration.
3. **Step 3**: Add dedicated `/companies` API router with full CRUD operations.
4. **Step 4**: Query Watermelon MCP tools (`search`, `get_inspiration`, `get_component`, `compose_page`) to inspect design patterns and component code.
5. **Step 5**: Revamp the frontend into an enterprise SaaS application with a collapsible sidebar and four distinct portals (Student, TPO, Recruiter, Admin).
6. **Step 6**: Comprehensive end-to-end testing, Docker containerization, and GitHub Actions CI pipeline.
