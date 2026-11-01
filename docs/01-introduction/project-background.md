# Project Background — Student Placement Management System

## 1. Introduction

The **Student Placement Management System (SPMS)** is a web-based application designed to centralize and streamline the entire campus placement process at **KIET Group of Institutions**. The system replaces fragmented, manual processes with a unified digital platform that serves students, placement officers, recruiters, and administrators.

This project is developed as a year-long B.Tech Computer Science Software Engineering Laboratory project, demonstrating the complete Software Development Life Cycle (SDLC) — from requirements elicitation and system design through implementation, testing, metrics analysis, deployment, and maintenance.

## 2. Evolution of Software Engineering

Software Engineering as a discipline emerged in the late 1960s in response to the **software crisis** — a period when software projects routinely exceeded budgets, missed deadlines, and delivered unreliable products. Key milestones include:

| Era | Development | Impact |
|-----|-------------|--------|
| **1950s–60s** | Ad-hoc programming | No formal methodology; software developed individually |
| **1968** | NATO Software Engineering Conference | Term "software engineering" coined; crisis formally recognized |
| **1970s** | Waterfall Model (Royce, 1970) | First formal process model; structured, sequential approach |
| **1980s** | Object-Oriented Programming | Encapsulation, reuse, and modular design concepts matured |
| **1990s** | Spiral Model, RUP | Risk-driven and iterative approaches gained traction |
| **2001** | Agile Manifesto | Emphasis on working software, collaboration, and adaptability |
| **2010s** | DevOps, CI/CD | Continuous integration and delivery; development and operations merge |
| **2020s** | AI-Assisted Development | Large language models augment coding, testing, and documentation |

SPMS benefits from these decades of evolution by adopting **Agile methodology** with **CI/CD practices** and **AI-assisted development** (Google Antigravity), while maintaining the discipline of structured documentation and formal design.

## 3. Background of Placement Management

Campus placements are a critical function of engineering colleges in India. The placement cell acts as a liaison between students seeking employment and companies seeking talent. A typical placement cycle involves:

1. **Student registration** — collecting academic and personal information.
2. **Company outreach** — inviting companies and coordinating schedules.
3. **Drive announcement** — publishing job descriptions, eligibility criteria, and deadlines.
4. **Eligibility verification** — matching students against company requirements.
5. **Application collection** — receiving and organizing applications.
6. **Selection process** — conducting multiple rounds (aptitude, coding, interviews).
7. **Result publication** — announcing selected candidates.
8. **Offer management** — tracking offers and acceptances.
9. **Reporting** — generating placement statistics for stakeholders.

At KIET Group of Institutions, the placement cell manages students across **9 departments** (CSE, CSE(AIML), CSE(AI), CSIT, IT, CS, ECE, EEE, ME) on a **semester system** (Semesters 1–8) with a **10-point CGPA scale**.

## 4. Existing Problems in Manual Placement Management

Current placement processes across many institutions, including typical practices at KIET, often rely on:

| Problem Area | Current Practice | Issues |
|-------------|-----------------|--------|
| **Student data** | Spreadsheets, Google Forms | Data duplication, version conflicts, incomplete records |
| **Communication** | WhatsApp groups, email chains | Messages missed, no audit trail, inconsistent reach |
| **Eligibility checks** | Manual spreadsheet filtering | Error-prone, time-consuming, no transparency for students |
| **Applications** | Google Forms per drive | No deduplication, no status tracking, difficult to correlate |
| **Scheduling** | Manual coordination | Double-bookings, confusion about venues/times |
| **Results** | Manually compiled and shared | Delayed publication, no centralized history |
| **Reporting** | Manual calculation in Excel | Inconsistent formulas, difficult to audit, no real-time view |
| **Access control** | Shared credentials or manual gatekeeping | Security risks, no accountability |

## 5. Software Crisis and Its Relevance

The **software crisis** refers to the difficulty of writing useful and efficient computer programs within the required time and budget. Its symptoms include:

- Projects exceeding budget and schedule.
- Software that doesn't meet requirements.
- Unmaintainable code.
- Software that is unreliable or insecure.

**Relevance to SPMS:**

Without systematic software engineering practices, a project of SPMS's scope (10+ modules, 4 user roles, 50+ API endpoints, complex business rules) would face the same risks:

- **Scope creep** without defined requirements → addressed by SRS and user stories.
- **Integration failures** without architecture → addressed by modular design and layer separation.
- **Unreliable features** without testing → addressed by multi-level testing strategy.
- **Maintenance difficulty** without documentation → addressed by comprehensive docs (Units 1–5).

SPMS applies the lessons of software engineering history to avoid the software crisis at project scale.

## 6. Why Systematic Software Development Is Necessary

| Concern | Without SE Practices | With SE Practices (SPMS Approach) |
|---------|---------------------|----------------------------------|
| Requirements | Vague, changing, undocumented | IEEE SRS, user stories, traceability |
| Design | Ad-hoc architecture | Modular monolith, UML diagrams, layer separation |
| Quality | No metrics, no standards | Halstead, cyclomatic complexity, SQA plan |
| Testing | Manual, inconsistent | pytest, Vitest, Playwright, Locust — automated CI |
| Deployment | Manual FTP uploads | Docker, GitHub Actions, automated pipelines |
| Maintenance | Firefighting | Categorized backlog (corrective/adaptive/perfective/preventive) |

## 7. Project Objectives

### Primary Objectives

1. **Centralize** the placement process into a single web application.
2. **Automate** eligibility verification, application tracking, and status management.
3. **Enforce** role-based access control for students, placement officers, recruiters, and administrators.
4. **Provide** real-time placement analytics and reporting.
5. **Ensure** data integrity, security, and auditability.

### Academic Objectives

6. **Demonstrate** the complete SDLC from planning through maintenance.
7. **Apply** software engineering principles (SOLID, DRY, separation of concerns).
8. **Produce** all required UML diagrams and design documentation.
9. **Implement** comprehensive testing (unit, integration, system, acceptance, performance).
10. **Calculate** software metrics using actual code (LOC, Halstead, FP, cyclomatic complexity).
11. **Deploy** using Docker and CI/CD pipelines.

## 8. Project Stakeholders

| Stakeholder | Role in SPMS | Primary Interest |
|-------------|-------------|------------------|
| **Students** | End users (applicants) | Easy profile management, transparent eligibility, application tracking |
| **Placement Officers** | Primary administrators | Efficient drive management, student verification, analytics |
| **Recruiters** | Company representatives | Candidate screening, round management, result updates |
| **System Administrator** | Technical administrator | User management, system configuration, audit logs |
| **College Administration** | Oversight | Placement statistics, compliance, institutional reputation |
| **Faculty Evaluators** | Academic assessors | Complete SDLC evidence, working software, documentation quality |

## 9. Expected Benefits

### For Students
- Single portal for all placement activities.
- Transparent eligibility criteria with clear explanations.
- Real-time application status tracking.
- Centralized interview schedules and results.
- Notification center for updates.

### For Placement Officers
- Automated eligibility filtering (no manual spreadsheet checks).
- Centralized student database with verification workflow.
- Drive management with configurable criteria.
- One-click analytics and reports.
- Audit trail for all placement decisions.

### For Recruiters
- Access to pre-verified, eligible candidate pools.
- Multi-round recruitment management.
- Structured shortlisting and result publication.

### For the Institution
- Accurate, real-time placement statistics.
- Professional digital infrastructure for placement activities.
- Data-driven decision making.
- Reduced manual effort and errors.

### For Academic Assessment
- Working demonstration of all 5 units of SE syllabus.
- Complete documentation portfolio.
- Verifiable test evidence and metrics.
