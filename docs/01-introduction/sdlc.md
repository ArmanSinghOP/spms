# Software Development Life Cycle (SDLC) — SPMS

## 1. Introduction

The Software Development Life Cycle (SDLC) is a structured process for planning, creating, testing, deploying, and maintaining software. It provides a systematic approach that reduces risks, controls costs, and ensures the final product meets requirements.

This document maps each SDLC stage to the actual milestones and deliverables of the Student Placement Management System (SPMS).

## 2. SDLC Stages

### 2.1 Planning

**Objective:** Define the project scope, objectives, feasibility, and development approach.

**Activities:**
- Identify the need for a placement management system.
- Conduct feasibility study (technical, economic, operational, schedule, legal).
- Select the development process model (Agile with Spiral risk checkpoints).
- Define the project timeline and milestones.
- Identify stakeholders and their roles.
- Establish development standards and conventions.

**SPMS Deliverables:**

| Deliverable | File | Status |
|-------------|------|--------|
| Project Background | `docs/01-introduction/project-background.md` | Phase 1 |
| Problem Statement | `docs/01-introduction/problem-statement.md` | Phase 1 |
| Feasibility Study | `docs/01-introduction/feasibility-study.md` | Phase 1 |
| Process Model Selection | `docs/01-introduction/software-process-models.md` | Phase 1 |
| Documentation Standards | `docs/01-introduction/documentation-and-standards.md` | Phase 1 |
| Project Progress Tracker | `PROJECT_PROGRESS.md` | Phase 0 |

---

### 2.2 Requirements Gathering

**Objective:** Collect requirements from all stakeholders using multiple elicitation techniques.

**Activities:**
- Conduct stakeholder analysis.
- Prepare interview questionnaires for placement officers and students.
- Design student surveys.
- Create observation checklists for the existing placement process.
- Conduct FAST (Facilitated Application Specification Technique) sessions.
- Develop low-fidelity prototypes for feedback.
- Build QFD (Quality Function Deployment) House of Quality matrix.

**SPMS Deliverables:**

| Deliverable | File | Status |
|-------------|------|--------|
| Stakeholder Analysis | `docs/02-requirements/stakeholder-analysis.md` | Phase 2 |
| Interview Questionnaire | `docs/02-requirements/interview-questionnaire.md` | Phase 2 |
| Student Survey | `docs/02-requirements/student-survey.md` | Phase 2 |
| Observation Study | `docs/02-requirements/observation-study.md` | Phase 2 |
| FAST Session | `docs/02-requirements/fast-session.md` | Phase 2 |
| Prototype Validation | `docs/02-requirements/prototype-validation.md` | Phase 2 |
| QFD Matrix | `docs/02-requirements/qfd-matrix.md` | Phase 2 |

---

### 2.3 Requirements Analysis

**Objective:** Analyze, organize, prioritize, and validate gathered requirements.

**Activities:**
- Classify requirements (functional, non-functional, constraints).
- Assign unique identifiers (FR-AUTH-001, NFR-PERF-001, etc.).
- Identify conflicts and dependencies.
- Prioritize requirements (MoSCoW or similar).
- Define acceptance criteria using Given/When/Then format.
- Create requirements traceability matrix.

**SPMS Deliverables:**

| Deliverable | File | Status |
|-------------|------|--------|
| Requirements Analysis | `docs/02-requirements/requirements-analysis.md` | Phase 2 |
| SRS (IEEE format) | `docs/02-requirements/SRS.md` | Phase 2 |
| User Stories | `docs/02-requirements/user-stories.md` | Phase 2 |
| Acceptance Criteria | `docs/02-requirements/acceptance-criteria.md` | Phase 2 |
| Traceability Matrix | `docs/02-requirements/requirements-traceability-matrix.csv` | Phase 2 |
| Validation Checklist | `docs/02-requirements/requirement-validation-checklist.md` | Phase 2 |

---

### 2.4 System Design

**Objective:** Design the architecture, data model, interfaces, and detailed module specifications.

**Activities:**
- Define system architecture (modular monolith with layered design).
- Design database schema (MongoDB collections, indexes, relationships).
- Create UML diagrams (use case, class, sequence, activity, state).
- Design API endpoints with OpenAPI specification.
- Write pseudocode for critical algorithms.
- Create flowcharts for major workflows.
- Analyze coupling and cohesion.
- Compare design strategies.

**SPMS Deliverables:**

| Deliverable | File | Status |
|-------------|------|--------|
| System Architecture | `docs/03-design/system-architecture.md` | Phase 3 |
| Design Strategies | `docs/03-design/design-strategies.md` | Phase 3 |
| Coupling & Cohesion | `docs/03-design/coupling-cohesion-analysis.md` | Phase 3 |
| Database Design | `docs/03-design/database-design.md` | Phase 3 |
| UML Diagrams | `docs/03-design/uml/` | Phase 3 |
| Pseudocode & Flowcharts | `docs/03-design/pseudocode-and-flowcharts.md` | Phase 3 |
| API Specification | `docs/03-design/api-specification.md` | Phase 3 |

---

### 2.5 Implementation

**Objective:** Write the application code following the design specifications.

**Activities:**
- Set up development environment and project structure.
- Implement backend modules (auth, students, companies, drives, eligibility, applications, rounds, results, notifications, analytics).
- Implement frontend portals (student, placement officer, recruiter, admin).
- Follow coding standards (Ruff for Python, ESLint for TypeScript).
- Apply SOLID, DRY, and separation of concerns principles.
- Write unit tests alongside implementation.

**SPMS Deliverables:**

| Deliverable | Location | Status |
|-------------|----------|--------|
| Backend application | `backend/` | Phase 4–5 |
| Frontend application | `frontend/` | Phase 6 |
| Integration | Phase 7 |
| Docker configuration | `docker-compose.yml`, `*/Dockerfile` | Phase 10 |

---

### 2.6 Testing

**Objective:** Verify that the software meets requirements and is free of critical defects.

**Activities:**
- Unit testing (pytest, Vitest).
- Integration testing (API + service + repository + database).
- System testing (end-to-end workflows).
- Acceptance testing (user stories + acceptance criteria).
- Regression testing (CI pipeline).
- Black-box testing (equivalence partitioning, boundary value analysis).
- White-box testing (statement, branch, path coverage).
- Performance testing (Locust/k6).
- Load and stress testing.

**SPMS Deliverables:**

| Deliverable | File | Status |
|-------------|------|--------|
| Test Strategy | `docs/05-testing/test-strategy.md` | Phase 8 |
| Backend Tests | `backend/tests/` | Phase 5, 8 |
| Frontend Tests | `frontend/tests/` | Phase 6, 8 |
| Test Reports | `docs/05-testing/` | Phase 8 |
| Coverage Reports | Generated by CI | Phase 8, 10 |
| Performance Reports | `docs/05-testing/` | Phase 8 |

---

### 2.7 Deployment

**Objective:** Make the application available to users in a production environment.

**Activities:**
- Build Docker images for backend and frontend.
- Configure production environment variables.
- Deploy backend to Render (or chosen provider).
- Deploy frontend to Vercel (or chosen provider).
- Configure CORS and API URL.
- Run smoke tests on production.
- Set up health checks and monitoring.
- Document deployment procedure.

**SPMS Deliverables:**

| Deliverable | File | Status |
|-------------|------|--------|
| CI/CD Pipeline | `.github/workflows/` | Phase 10 |
| Deployment Documentation | `docs/06-devops/` | Phase 11 |
| Deployed Application | Production URL | Phase 11 |

---

### 2.8 Maintenance

**Objective:** Ensure the software continues to operate correctly and evolves to meet new needs.

**Activities:**
- Corrective maintenance (fix defects discovered after deployment).
- Adaptive maintenance (adapt to new environments, dependencies, policies).
- Perfective maintenance (improve features, performance, usability).
- Preventive maintenance (refactor, update dependencies, improve coverage).

**SPMS Deliverables:**

| Deliverable | File | Status |
|-------------|------|--------|
| Maintenance Plan | `docs/05-testing/maintenance-plan.md` | Phase 12 |
| Maintenance Backlog | `MAINTENANCE_BACKLOG.md` | Ongoing |
| Change Log | `CHANGELOG.md` | Ongoing |

---

## 3. SDLC Stage-to-Phase Mapping

| SDLC Stage | SPMS Phase(s) | Timeline |
|------------|---------------|----------|
| Planning | Phase 0, 1 | Week 1 |
| Requirements Gathering | Phase 2 | Weeks 2–3 |
| Requirements Analysis | Phase 2 | Weeks 2–3 |
| System Design | Phase 3 | Weeks 3–4 |
| Implementation | Phases 4–7 | Weeks 5–14 |
| Testing | Phase 8 (+ throughout) | Weeks 14–16 |
| Deployment | Phases 10–11 | Weeks 16–18 |
| Maintenance | Phase 12 (+ ongoing) | Weeks 18+ |

## 4. SDLC Visualization

```
┌──────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Planning │───>│    Requirements   │───>│  Requirements     │
│ (Ph 0-1) │    │    Gathering      │    │  Analysis         │
└──────────┘    │    (Ph 2)         │    │  (Ph 2)           │
                └──────────────────┘    └────────┬─────────┘
                                                 │
                                                 ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│ Maintenance  │<───│  Deployment  │<───│  System Design   │
│ (Ph 12)      │    │  (Ph 10-11)  │    │  (Ph 3)          │
└──────────────┘    └──────────────┘    └────────┬─────────┘
       ▲                    ▲                     │
       │                    │                     ▼
       │            ┌──────────────┐    ┌──────────────────┐
       └────────────│   Testing    │<───│  Implementation  │
                    │   (Ph 8)     │    │  (Ph 4-7)        │
                    └──────────────┘    └──────────────────┘
```

> [!NOTE]
> While shown sequentially, SPMS uses an Agile approach where testing and documentation occur continuously throughout all phases, not just in their dedicated phase.
