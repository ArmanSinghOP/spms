# CASE Tools — SPMS

## 1. Introduction

Computer-Aided Software Engineering (CASE) tools assist software developers throughout the SDLC. CASE tools automate repetitive tasks, enforce standards, improve quality, and increase productivity.

This document identifies the CASE tools used in the Student Placement Management System and maps each tool to its role in the SDLC.

## 2. Classification of CASE Tools

| Category | Description | SDLC Phase |
|----------|-------------|------------|
| **Upper CASE** | Support planning, analysis, and design | Requirements, Design |
| **Lower CASE** | Support implementation, testing, and deployment | Implementation, Testing, Deployment |
| **Integrated CASE** | Support the entire lifecycle | All phases |

## 3. CASE Tools Used in SPMS

### 3.1 Google Antigravity — AI-Assisted Development

| Attribute | Details |
|-----------|---------|
| **Category** | Integrated CASE (all phases) |
| **Purpose** | AI-powered coding assistant for development, documentation, testing, and debugging |
| **SDLC Phases** | All phases — requirements writing, code generation, test creation, documentation |
| **Role in SPMS** | Primary development environment; assists with code writing, architecture decisions, documentation generation, and test creation |

**How It Fits:**
- **Planning** — Helps structure project documentation and create feasibility analysis.
- **Requirements** — Assists in writing SRS, user stories, and acceptance criteria.
- **Design** — Generates UML diagrams (PlantUML), architecture documentation.
- **Implementation** — Code generation, refactoring suggestions, best practice enforcement.
- **Testing** — Test case generation, coverage analysis, performance test scripting.
- **Deployment** — Dockerfile creation, CI/CD pipeline configuration.
- **Maintenance** — Code review, dependency analysis, technical debt identification.

---

### 3.2 Draw.io — Diagramming Tool

| Attribute | Details |
|-----------|---------|
| **Category** | Upper CASE |
| **Purpose** | General-purpose diagramming for system architecture, flowcharts, DFDs, and deployment diagrams |
| **SDLC Phases** | Requirements Analysis, System Design |
| **Role in SPMS** | Create system context diagrams, DFDs, deployment diagrams, and flowcharts that are better expressed outside of PlantUML |

**How It Fits:**
- **Design** — System context diagrams, deployment diagrams, network architecture.
- **Documentation** — Visual representations for academic documentation.
- Export format: SVG/PNG stored in `docs/03-design/diagrams/`.

---

### 3.3 PlantUML — UML Diagram Generator

| Attribute | Details |
|-----------|---------|
| **Category** | Upper CASE |
| **Purpose** | Text-based UML diagram generation (use case, class, sequence, activity, state diagrams) |
| **SDLC Phases** | System Design |
| **Role in SPMS** | Create all required UML diagrams from version-controlled text source files |

**How It Fits:**
- **Design** — All UML diagrams specified in Unit 3 requirements.
- Source files (`.puml`) stored in `docs/03-design/uml/source/`.
- Rendered outputs (SVG/PNG) stored in `docs/03-design/uml/rendered/`.
- **Advantage** — Text-based sources can be version-controlled, diffed, and regenerated.

---

### 3.4 Git and GitHub — Version Control System

| Attribute | Details |
|-----------|---------|
| **Category** | Integrated CASE (configuration management) |
| **Purpose** | Source code version control, collaboration, code review, and project management |
| **SDLC Phases** | All phases |
| **Role in SPMS** | Track all changes to code and documentation; manage branches and releases |

**How It Fits:**
- **All Phases** — Every file in the project is version-controlled.
- **Implementation** — Feature branches, commit history, pull requests.
- **Code Review** — Pull request reviews before merging.
- **Release Management** — Tags and releases for milestones.
- **Collaboration** — Issues and project boards for task tracking.
- Branch workflow: `main` ← `feature/*`, `bugfix/*`, `hotfix/*`.

---

### 3.5 Postman — API Testing Tool

| Attribute | Details |
|-----------|---------|
| **Category** | Lower CASE (testing) |
| **Purpose** | Manual and automated API testing, request collection management |
| **SDLC Phases** | Testing, Integration |
| **Role in SPMS** | Test API endpoints during development; create and share request collections |

**How It Fits:**
- **Integration Testing** — Manually verify API responses during development.
- **Documentation** — Export Postman collections as API usage examples.
- **Test Automation** — Collection runner for automated API test sequences.
- **Debugging** — Inspect headers, payloads, and authentication flow.

---

### 3.6 Swagger UI — API Documentation

| Attribute | Details |
|-----------|---------|
| **Category** | Lower CASE (documentation) |
| **Purpose** | Interactive API documentation generated from OpenAPI specification |
| **SDLC Phases** | Implementation, Documentation |
| **Role in SPMS** | Auto-generated from FastAPI; provides interactive "try it" interface for all endpoints |

**How It Fits:**
- **Implementation** — Developers use Swagger UI to test endpoints during development.
- **Documentation** — Serves as the definitive API reference.
- **Validation** — Request/response schemas visible and testable directly.
- Access at: `http://localhost:8000/docs`.

---

### 3.7 MongoDB Atlas — Cloud Database Management

| Attribute | Details |
|-----------|---------|
| **Category** | Lower CASE (database management) |
| **Purpose** | Cloud-hosted MongoDB database with monitoring, backup, and security features |
| **SDLC Phases** | Implementation, Deployment, Maintenance |
| **Role in SPMS** | Production database hosting with built-in monitoring and management tools |

**How It Fits:**
- **Implementation** — Development and staging databases on free M0 cluster.
- **Deployment** — Production database with secure connection strings.
- **Monitoring** — Atlas dashboard shows query performance, connections, storage.
- **Security** — IP allowlisting, database user management, encryption at rest.

**MongoDB Compass** (desktop GUI) complements Atlas for:
- Visual query building.
- Index management.
- Schema visualization.
- Data inspection during development.

---

### 3.8 Docker — Containerization Platform

| Attribute | Details |
|-----------|---------|
| **Category** | Lower CASE (deployment, DevOps) |
| **Purpose** | Package applications and dependencies into portable, reproducible containers |
| **SDLC Phases** | Implementation, Testing, Deployment |
| **Role in SPMS** | Containerize backend and frontend for consistent development and deployment |

**How It Fits:**
- **Implementation** — Docker Compose for local multi-container development.
- **Testing** — Consistent test environments across machines.
- **Deployment** — Same container image deployed to staging and production.
- **Portability** — Runs identically on any Docker-capable system.

---

### 3.9 GitHub Actions — CI/CD Platform

| Attribute | Details |
|-----------|---------|
| **Category** | Lower CASE (CI/CD, automation) |
| **Purpose** | Automated build, test, and deployment pipelines triggered by Git events |
| **SDLC Phases** | Testing, Deployment, Maintenance |
| **Role in SPMS** | Run linting, tests, and builds on every pull request; automate deployment |

**How It Fits:**
- **Testing** — Automated test execution on every PR (pytest, Vitest, ESLint, Ruff).
- **Quality Gates** — Block merges if tests fail or coverage drops.
- **Deployment** — Automated staging/production deployment after merge to main.
- **Security** — Dependency vulnerability scanning, secret scanning.

---

## 4. CASE Tool to SDLC Phase Mapping

| SDLC Phase | CASE Tools Used |
|------------|----------------|
| **Planning** | Google Antigravity, Git/GitHub |
| **Requirements** | Google Antigravity, Draw.io, PlantUML |
| **Design** | PlantUML, Draw.io, Google Antigravity |
| **Implementation** | Google Antigravity, MongoDB Atlas/Compass, Swagger UI, Git |
| **Testing** | pytest, Vitest, Postman, Locust/k6, GitHub Actions |
| **Deployment** | Docker, GitHub Actions, Render/Vercel |
| **Maintenance** | Git/GitHub, MongoDB Atlas, GitHub Actions |

## 5. Additional Development Tools

| Tool | Purpose | Category |
|------|---------|----------|
| **Ruff** | Python linting and formatting | Code quality |
| **ESLint** | TypeScript/JavaScript linting | Code quality |
| **Radon** | Python cyclomatic complexity analysis | Metrics |
| **pytest-cov** | Python test coverage | Testing |
| **Vitest** | Frontend unit/component testing | Testing |
| **React Testing Library** | Component testing utilities | Testing |
| **Playwright** | End-to-end browser testing | Testing |
| **Locust / k6** | Performance and load testing | Testing |
| **Pydantic v2** | Data validation and serialization | Implementation |
| **Zod** | Frontend schema validation | Implementation |
