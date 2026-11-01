# Feasibility Study — Student Placement Management System

## 1. Introduction

This feasibility study evaluates whether the Student Placement Management System (SPMS) is viable from technical, economic, operational, schedule, and legal perspectives. The study identifies risks and proposes mitigation strategies for each area.

## 2. Technical Feasibility

### 2.1 Assessment: **FEASIBLE** ✅

The proposed technology stack consists of mature, well-documented, and widely-used technologies.

| Component | Technology | Maturity | Risk Level |
|-----------|-----------|----------|------------|
| Backend framework | FastAPI (Python) | Stable, v0.100+ | Low |
| Frontend framework | React 19 + TypeScript | Industry standard | Low |
| Database | MongoDB Atlas (cloud) | Enterprise-grade | Low |
| Auth | JWT + Argon2 | Industry standard | Low |
| Containerization | Docker | Industry standard | Low |
| CI/CD | GitHub Actions | Widely adopted | Low |
| Build tool | Vite | Stable, fast | Low |
| CSS | Tailwind CSS v4 | Latest release | Low–Medium |

### 2.2 Technical Capabilities

| Requirement | Available Solution |
|------------|-------------------|
| Async API server | FastAPI with async/await |
| Document database | MongoDB Atlas (free M0 tier) |
| Async DB driver | PyMongo Async API (native) |
| Role-based access | JWT claims + FastAPI dependencies |
| File uploads | FastAPI UploadFile + local storage |
| Real-time validation | Pydantic v2 + Zod |
| Responsive UI | Tailwind CSS + React |
| API documentation | OpenAPI / Swagger UI (built into FastAPI) |
| Testing | pytest, Vitest, Playwright, Locust |
| Version control | Git + GitHub |

### 2.3 Developer Skills

The project is developed by a B.Tech CS student with access to:
- Python and web development coursework.
- AI-assisted development tools (Google Antigravity).
- Online documentation and community resources.

**Risk:** Single developer — mitigated by incremental development and comprehensive documentation.

### 2.4 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| PyMongo Async API is relatively new | Low | Medium | Use stable releases; fall back to synchronous API if blocking issues arise |
| Tailwind CSS v4 has fewer tutorials than v3 | Low | Low | Official documentation is comprehensive; syntax changes are well-documented |
| MongoDB Atlas free tier limits (512 MB storage) | Medium | Medium | Use efficient data modeling; monitor usage; upgrade if needed for production |
| Python 3.10 nearing EOL | Low | Low | Adequate for academic project timeline; document for future migration |

---

## 3. Economic Feasibility

### 3.1 Assessment: **FEASIBLE** ✅

SPMS is designed to operate within **zero or minimal cost** constraints suitable for a student project.

### 3.2 Development Costs

| Item | Estimated Cost | Notes |
|------|---------------|-------|
| Development labor | ₹0 (student project) | Academic requirement, not commercial engagement |
| IDE / Editor | ₹0 | VS Code (free) + Google Antigravity |
| Python, Node.js, Git | ₹0 | Open-source software |
| React, FastAPI, libraries | ₹0 | Open-source (MIT/BSD/Apache licensed) |
| Docker | ₹0 | Docker Desktop (free for education) |
| GitHub | ₹0 | Free tier (public/private repos) |

> [!NOTE]
> All cost figures are estimates based on publicly available pricing at the time of writing. Actual costs may vary.

### 3.3 Infrastructure Costs

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|----------------------|
| MongoDB Atlas M0 | 512 MB storage, shared cluster | ₹0 |
| Render (backend hosting) | 750 hours/month free | ₹0 |
| Vercel (frontend hosting) | 100 GB bandwidth/month | ₹0 |
| GitHub Actions | 2,000 minutes/month (free) | ₹0 |
| Custom domain (optional) | N/A | ~₹500–1,000/year if needed |

### 3.4 Estimated Total Cost

| Phase | Estimated Cost |
|-------|---------------|
| Development | ₹0 |
| Hosting (free tiers) | ₹0 |
| Domain (optional) | ₹0–1,000/year |
| **Total (first year)** | **₹0–1,000** |

### 3.5 Economic Benefits

- Eliminates manual effort in eligibility checking (estimated hours saved per placement season: significant, but not quantified without real usage data).
- Reduces communication overhead.
- Provides reliable placement statistics for accreditation without manual compilation.

### 3.6 Economic Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Free tier limits exceeded | Low | Low | Monitor usage; optimize queries; upgrade only if justified |
| Hosting provider changes free tier | Low | Medium | Application is containerized; can migrate to alternative providers |

---

## 4. Operational Feasibility

### 4.1 Assessment: **FEASIBLE** ✅

### 4.2 User Readiness

| User Group | Technical Comfort | Adoption Risk |
|------------|------------------|---------------|
| Students | High (digital natives, use web apps daily) | Low |
| Placement Officers | Medium (use spreadsheets and forms) | Medium |
| Recruiters | Medium–High (use HR platforms) | Low |
| Administrators | Medium (IT/CS background assumed) | Low |

### 4.3 Organizational Readiness

| Factor | Assessment |
|--------|-----------|
| Willingness to change | Placement cells actively seek automation tools |
| Training requirements | Minimal — intuitive web interface with role-based dashboards |
| Data migration | Initial manual data entry or CSV import for existing student records |
| Process changes | Shifts from spreadsheets/forms to structured web workflows |

### 4.4 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Resistance from staff comfortable with manual process | Medium | Medium | Demonstrate time savings; provide training; gradual rollout |
| Data quality issues during migration | Medium | Medium | Validate imported data; require student self-verification |
| Incomplete adoption (some activities remain manual) | Medium | Low | Design system to be useful even with partial adoption |

---

## 5. Schedule Feasibility

### 5.1 Assessment: **FEASIBLE** ✅

The project follows a year-long academic timeline with 12 phases.

### 5.2 High-Level Timeline

| Phase | Estimated Duration | Target Period |
|-------|-------------------|---------------|
| Phase 0–1: Setup & Introduction docs | 1 week | November 2026 |
| Phase 2: Requirements engineering | 1–2 weeks | November 2026 |
| Phase 3: System design & UML | 1–2 weeks | November–December 2026 |
| Phase 4: Database setup | 1–2 days | December 2026 |
| Phase 5: Backend development | 3–4 weeks | December 2026 – January 2027 |
| Phase 6: Frontend development | 3–4 weeks | January–February 2027 |
| Phase 7: Integration | 1 week | February 2027 |
| Phase 8: Testing & QA | 1–2 weeks | February–March 2027 |
| Phase 9: Metrics & evaluation | 1 week | March 2027 |
| Phase 10: Docker & CI/CD | 1 week | March 2027 |
| Phase 11: Deployment | 1 week | March–April 2027 |
| Phase 12: Final submission | 1–2 weeks | April 2027 |

> [!IMPORTANT]
> These are estimates. Actual timelines depend on the student's availability alongside other academic commitments.

### 5.3 Schedule Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Academic workload limits development time | High | Medium | Agile sprints allow flexible pacing; core features prioritized first |
| Scope creep extends timeline | Medium | Medium | Defined SRS scope; defer non-essential features to maintenance backlog |
| Integration issues delay later phases | Medium | Medium | Test each module incrementally; integration starts early in Phase 7 |

---

## 6. Legal and Privacy Feasibility

### 6.1 Assessment: **FEASIBLE** ✅ (with documented precautions)

### 6.2 Data Privacy Considerations

| Concern | Approach |
|---------|----------|
| Student personal information | Collected only what is necessary; stored securely in MongoDB Atlas |
| Passwords | Hashed with Argon2; never stored in plaintext |
| Academic records | Access restricted to authorized roles; verified records are immutable |
| Recruiter/company data | Standard business information; no sensitive personal data |
| Placement results | Access controlled; audit trail maintained |

### 6.3 Compliance Considerations

| Area | Status |
|------|--------|
| IT Act, 2000 (India) | Reasonable security practices implemented (encryption, access control, logging) |
| UGC / AICTE data handling | No specific digital placement system mandates; standard data protection applied |
| GDPR | Not directly applicable (Indian institution), but privacy-by-design principles adopted |
| Open-source licenses | All libraries use permissive licenses (MIT, BSD, Apache 2.0) |

### 6.4 Legal Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Mishandling of student data | Low | High | Role-based access, password hashing, audit logs, no secret exposure |
| Using copyrighted content | Low | Low | Only open-source software; dummy data for development |
| Licensing conflicts | Very Low | Low | All chosen libraries have permissive licenses |

### 6.5 Ethical Safeguards

- Development uses clearly labelled **dummy/fictional data**.
- No real student information is hardcoded or committed to version control.
- Administrative functions are protected by RBAC.
- Eligibility decisions are transparent and auditable.

---

## 7. Feasibility Summary

| Dimension | Verdict | Key Considerations |
|-----------|---------|-------------------|
| Technical | ✅ Feasible | Mature tech stack, well-documented tools, manageable complexity |
| Economic | ✅ Feasible | Zero-cost development, free-tier hosting, open-source stack |
| Operational | ✅ Feasible | Target users are technically comfortable; intuitive web interface |
| Schedule | ✅ Feasible | Year-long timeline with incremental delivery; flexible Agile approach |
| Legal/Privacy | ✅ Feasible | Standard security practices; dummy data during development; RBAC |

**Overall Assessment: The project is feasible and should proceed to requirements engineering and system design.**
