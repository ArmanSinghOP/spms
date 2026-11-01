# Student Placement Management System (SPMS)

A comprehensive web-based platform for managing the complete college placement process at **KIET Group of Institutions**.

Built as a year-long B.Tech Computer Science Software Engineering Laboratory project demonstrating the complete Software Development Life Cycle (SDLC).

---

## 🎯 Project Overview

SPMS centralizes placement activities — student registration, company management, placement drives, eligibility verification, application tracking, recruitment rounds, results, notifications, and analytics — into a single, role-based web application.

### User Roles

| Role | Description |
|------|-------------|
| **Student** | Register, manage profile, check eligibility, apply to drives, view results |
| **Placement Officer** | Manage students, companies, drives, verify profiles, publish results, view analytics |
| **Recruiter** | Manage company drives, shortlist candidates, schedule rounds, update results |
| **Admin** | System configuration, user management, department management, audit logs |

---

## 🏗️ Architecture

**Modular Monolith** with layered separation of concerns.

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Python + FastAPI + Pydantic v2 |
| Database | MongoDB Atlas (PyMongo Async) |
| Auth | JWT (Access + Refresh Tokens) + Argon2 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## 📁 Repository Structure

```
├── backend/          # FastAPI backend application
├── frontend/         # React + TypeScript frontend
├── docs/             # Complete SE documentation (Units 1-5)
│   ├── 01-introduction/
│   ├── 02-requirements/
│   ├── 03-design/
│   ├── 04-quality/
│   ├── 05-testing/
│   └── 06-devops/
├── .github/workflows/ # CI/CD pipelines
├── deployment/        # Deployment configurations
├── scripts/           # Utility scripts
├── docker-compose.yml
├── PROJECT_PROGRESS.md
├── CHANGELOG.md
└── MAINTENANCE_BACKLOG.md
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 20+
- Docker & Docker Compose
- MongoDB Atlas account

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
# Configure .env (see .env.example)
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
# Configure .env (see .env.example)
npm run dev
```

### Docker Setup

```bash
docker-compose up --build
```

---

## 📖 Documentation

| Document | Location |
|----------|----------|
| Project Background | `docs/01-introduction/` |
| SRS (IEEE format) | `docs/02-requirements/SRS.md` |
| System Design & UML | `docs/03-design/` |
| Quality & Metrics | `docs/04-quality/` |
| Testing & Maintenance | `docs/05-testing/` |
| CI/CD Pipeline | `docs/06-devops/` |
| API Documentation | `http://localhost:8000/docs` (Swagger UI) |

---

## 🧪 Testing

```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm test

# E2E tests
npx playwright test
```

---

## 📋 Academic Context

This project covers all five units of the B.Tech SE Lab syllabus:

1. **Unit 1** — Introduction to Software Engineering, SDLC, Process Models
2. **Unit 2** — Requirements Engineering, SRS, Elicitation Techniques
3. **Unit 3** — Software Design, UML Modeling, Architecture
4. **Unit 4** — Software Metrics, Quality Assurance, Verification & Validation
5. **Unit 5** — Software Testing, Maintenance, CI/CD

---

## 📜 License

This project is developed for academic purposes at KIET Group of Institutions.

---

## 👤 Author

B.Tech Computer Science Student  
KIET Group of Institutions
