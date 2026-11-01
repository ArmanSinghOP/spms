# Software Quality Characteristics — SPMS

## 1. Introduction

This document identifies the key characteristics of good software as defined by software engineering standards (ISO/IEC 25010, McCall's Quality Model) and describes how the Student Placement Management System (SPMS) will demonstrate each characteristic.

## 2. Quality Characteristics

### 2.1 Correctness

**Definition:** The degree to which the software satisfies its specified requirements and produces the right output for given inputs.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Eligibility engine | Evaluates each criterion independently against the drive's requirements; produces a correct eligible/ineligible decision with detailed explanations |
| Application rules | Enforces deadlines, prevents duplicates, validates status transitions — all based on SRS requirements |
| Analytics | Placement percentages use clearly defined denominators (documented in the analytics module); calculations are unit-tested |
| CGPA validation | Accepts values in the 0.0–10.0 range on the 10-point scale; rejects out-of-range values |

**Verification:** Unit tests, integration tests, and acceptance tests verify that every functional requirement (FR-*) produces correct results.

---

### 2.2 Reliability

**Definition:** The probability that the software will operate without failure under specified conditions for a specified period.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Database operations | Duplicate application prevention via unique compound index (student + drive) — reliable even under concurrent submissions |
| Error handling | Structured error responses with appropriate HTTP status codes; no unhandled exceptions crash the server |
| Data integrity | Validated inputs (Pydantic v2 on backend, Zod on frontend); atomic MongoDB operations where needed |
| Health checks | `/api/v1/health` endpoint verifies database connectivity; Docker health checks monitor container status |

**Verification:** Integration tests, load tests (Locust/k6), and error-injection scenarios.

---

### 2.3 Efficiency

**Definition:** The degree to which the software uses computational resources (time, memory, bandwidth) effectively.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Async I/O | FastAPI with PyMongo Async — non-blocking database operations, efficient request handling |
| Database indexes | Indexes on frequently queried fields (email, student-drive combination, drive status, notification recipient) |
| Pagination | All list endpoints return paginated results; no unbounded queries |
| Frontend caching | TanStack Query caches server responses; avoids redundant API calls |
| Bundle optimization | Vite code splitting and tree shaking for minimal frontend bundle |

**Verification:** Performance tests measuring response times (target: P95 < 500ms for standard operations under 50 concurrent users).

---

### 2.4 Usability

**Definition:** The ease with which users can learn, operate, and interact with the software.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Role-based dashboards | Each user role sees a tailored dashboard with relevant actions and information |
| Form validation | Real-time validation feedback with clear error messages (React Hook Form + Zod) |
| Empty states | Helpful messages when no data exists (e.g., "No placement drives available yet") |
| Loading states | Skeleton loaders indicate data is being fetched |
| Error states | User-friendly error messages with suggested actions |
| Responsive design | Works on desktop and mobile devices (Tailwind CSS responsive utilities) |
| Navigation | Consistent sidebar navigation with role-appropriate menu items |
| Confirmation dialogs | Destructive or important actions require explicit confirmation |

**Verification:** Usability testing with sample users; acceptance test cases.

---

### 2.5 Maintainability

**Definition:** The ease with which the software can be modified to fix defects, add features, or adapt to changes.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Modular architecture | 10 independent modules with clearly defined interfaces |
| Layer separation | Router → Service → Repository → Database (no business logic in route handlers) |
| SOLID principles | Single responsibility per module; dependency injection via FastAPI |
| DRY | Reusable components, shared utilities, common schemas |
| Documentation | Comprehensive docs covering requirements, design, API, tests |
| Code quality | Ruff linting, TypeScript strict mode, ESLint |
| Version control | Git with branch-based workflow; meaningful commit messages |

**Verification:** Cyclomatic complexity analysis (target: <10 per function); code review checklists; maintainability index from static analysis.

---

### 2.6 Security

**Definition:** The degree to which the software protects information and data from unauthorized access or modification.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Authentication | JWT access tokens with expiration; refresh token rotation |
| Password security | Argon2 hashing (no plaintext storage) |
| Authorization | Role-based access control enforced on backend (not just frontend) |
| Input validation | Pydantic v2 on backend, Zod on frontend — prevent injection and malformed data |
| Secret management | `.env` files excluded from Git; secrets never in code or logs |
| Role escalation prevention | Public registration cannot assign admin/officer roles |
| Verified data protection | Students cannot modify verified academic fields |
| Audit logging | Selection-related actions logged with timestamp, user ID, and action type |

**Verification:** Security-focused test cases; dependency vulnerability scanning; code review for secret exposure.

---

### 2.7 Portability

**Definition:** The ease with which the software can be transferred from one environment to another.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Docker containerization | Backend and frontend run in Docker containers; identical across environments |
| Environment configuration | All environment-specific values in `.env` files; no hardcoded URLs or credentials |
| Cloud database | MongoDB Atlas is accessible from any deployment environment |
| CI/CD | GitHub Actions workflows run on any GitHub-hosted runner |
| Standard web technologies | React SPA runs in any modern browser; FastAPI runs on any Python 3.10+ environment |

**Verification:** Successful deployment to different hosting providers (Render, Vercel); Docker Compose runs on different OS environments.

---

### 2.8 Scalability

**Definition:** The system's ability to handle increased load by adding resources.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Stateless backend | JWT-based auth allows horizontal scaling of API servers |
| Async processing | FastAPI handles concurrent requests efficiently |
| Database scaling | MongoDB Atlas supports vertical and horizontal scaling (replica sets, sharding) |
| Indexed queries | Database indexes prevent full collection scans as data grows |
| Pagination | List endpoints paginate results regardless of total count |

**Verification:** Load testing with progressive user counts (50 → 100 → 200 virtual users); response time degradation analysis.

> [!NOTE]
> As an academic project, SPMS targets modest scale (hundreds of students, tens of companies). The architecture supports growth, but production-scale optimization is not the primary goal.

---

### 2.9 Testability

**Definition:** The degree to which the software facilitates the creation and execution of test cases.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Dependency injection | FastAPI dependencies make services mockable for unit testing |
| Layer separation | Services can be tested independently of routers and database |
| Test fixtures | Shared test data and database fixtures for consistent test execution |
| Coverage tooling | pytest-cov for backend; Vitest coverage for frontend |
| CI integration | All tests run automatically on every pull request |
| Test organization | Separate unit, integration, and E2E test directories |

**Verification:** Coverage reports (target: ≥70% overall, ≥80% critical logic); test execution in CI pipelines.

---

### 2.10 Availability

**Definition:** The degree to which the system is operational and accessible when required for use.

**How SPMS Demonstrates This:**

| Area | Implementation |
|------|---------------|
| Cloud hosting | MongoDB Atlas provides 99.95% SLA (on paid tiers); free tier has reasonable uptime |
| Health monitoring | `/api/v1/health` endpoint for uptime monitoring |
| Docker health checks | Container-level health monitoring |
| Graceful error handling | Application continues operating when non-critical operations fail |
| Deployment strategy | CI/CD pipeline with smoke tests before production deployment |

**Verification:** Health check monitoring; uptime tracking during deployment.

---

## 3. Quality Characteristics Summary

| Characteristic | Priority for SPMS | Primary Verification Method |
|---------------|-------------------|---------------------------|
| Correctness | **Critical** | Unit tests, acceptance tests |
| Reliability | **Critical** | Integration tests, load tests |
| Security | **Critical** | Security tests, code review, audit |
| Usability | **High** | User acceptance testing |
| Maintainability | **High** | Static analysis, cyclomatic complexity |
| Efficiency | **High** | Performance tests |
| Testability | **High** | Coverage reports, CI pipeline |
| Portability | **Medium** | Docker deployment, multi-environment testing |
| Scalability | **Medium** | Load testing |
| Availability | **Medium** | Health checks, monitoring |
