# Software Process Models — SPMS

## 1. Introduction

A software process model defines the sequence of activities, deliverables, and milestones for software development. Choosing the right model is critical for project success. This document compares four major process models and justifies the choice for SPMS.

---

## 2. Waterfall Model

### 2.1 Working Principle

The Waterfall Model is a **sequential, linear** process where each phase must be completed before the next begins. Requirements are fully defined upfront, and there is no backtracking.

```
Requirements → Design → Implementation → Testing → Deployment → Maintenance
     ↓            ↓           ↓              ↓           ↓            ↓
  (complete)   (complete)  (complete)     (complete)  (complete)   (ongoing)
```

Each phase produces defined deliverables that serve as input to the next phase.

### 2.2 Advantages

| Advantage | Explanation |
|-----------|-------------|
| Simple and structured | Easy to understand and manage; clear milestones |
| Well-documented | Each phase produces comprehensive documentation |
| Easy progress tracking | Completion of each phase is clearly defined |
| Discipline | Forces thorough requirements analysis before design begins |
| Works for stable requirements | Effective when requirements are well-understood and unlikely to change |

### 2.3 Disadvantages

| Disadvantage | Explanation |
|-------------|-------------|
| No flexibility | Changes in requirements require restarting from earlier phases |
| Late testing | Defects are discovered only after implementation is complete |
| High risk | Working software is not available until late in the project |
| Customer feedback delayed | Users see the product only at the end |
| Assumes perfect requirements | Rarely realistic for complex projects |

### 2.4 Suitability for SPMS

**Rating: PARTIALLY SUITABLE** ⚠️

- ✅ SPMS benefits from Waterfall's emphasis on documentation (academic requirement).
- ❌ Requirements will evolve based on stakeholder feedback and prototype evaluation.
- ❌ A year-long project needs intermediate deliverables, not a single final delivery.
- ❌ Late testing is risky for a project with complex business rules (eligibility, applications).

---

## 3. Incremental Model

### 3.1 Working Principle

The Incremental Model divides the system into **smaller, self-contained increments**. Each increment goes through its own mini-SDLC (requirements → design → implementation → testing) and delivers a working subset of functionality.

```
Increment 1: Auth + Student Module    ──→ Working Subset 1
Increment 2: Companies + Drives       ──→ Working Subset 2
Increment 3: Eligibility + Applications ──→ Working Subset 3
Increment 4: Recruitment + Results     ──→ Working Subset 4
Increment 5: Notifications + Analytics ──→ Working Subset 5
```

### 3.2 Advantages

| Advantage | Explanation |
|-----------|-------------|
| Early delivery | Working software available after the first increment |
| Reduced risk | Core features delivered first; problems detected early |
| Flexible prioritization | High-priority modules implemented first |
| Manageable complexity | Each increment is small enough to develop and test thoroughly |
| User feedback | Stakeholders can provide feedback after each increment |

### 3.3 Disadvantages

| Disadvantage | Explanation |
|-------------|-------------|
| Integration challenges | Later increments may require refactoring earlier ones |
| Planning complexity | Requires careful module decomposition upfront |
| Interface changes | Interfaces between increments may evolve, requiring updates |
| Total cost may increase | Iterative integration adds overhead |

### 3.4 Suitability for SPMS

**Rating: HIGHLY SUITABLE** ✅

- ✅ SPMS is naturally modular (auth, students, companies, drives, etc.).
- ✅ Each module can be developed, tested, and demonstrated independently.
- ✅ Aligns with academic milestones (show progress in each lab session).
- ✅ Core functionality (auth, students) is prioritized before advanced features (analytics).

---

## 4. Spiral Model

### 4.1 Working Principle

The Spiral Model combines iterative development with **systematic risk assessment**. Each cycle (spiral) includes four phases:

1. **Planning** — Determine objectives, alternatives, and constraints.
2. **Risk Analysis** — Identify and evaluate risks; build prototypes to reduce uncertainty.
3. **Engineering** — Develop and test the product.
4. **Evaluation** — Review results with stakeholders; plan the next iteration.

```
        Planning
       ╱        ╲
    Risk          Engineering
   Analysis        (Build)
       ╲        ╱
       Evaluation
       (then next spiral)
```

### 4.2 Advantages

| Advantage | Explanation |
|-----------|-------------|
| Risk-driven | Risks are identified and mitigated at every iteration |
| Flexible | Accommodates changes in requirements naturally |
| Prototyping | Reduces uncertainty through early prototypes |
| Stakeholder involvement | Regular evaluation ensures alignment with expectations |
| Combines strengths | Integrates Waterfall documentation with iterative flexibility |

### 4.3 Disadvantages

| Disadvantage | Explanation |
|-------------|-------------|
| Complex management | Requires skilled risk assessment and planning |
| Costly | Risk analysis adds overhead; better suited for large, expensive projects |
| Not widely adopted for small projects | Overhead may outweigh benefits for simple systems |
| Difficult to define milestones | Spiral boundaries are less clear than Waterfall phases |

### 4.4 Suitability for SPMS

**Rating: PARTIALLY SUITABLE** ⚠️

- ✅ Risk assessment is valuable (database setup, Atlas connectivity, complex eligibility logic).
- ✅ Prototyping aligns with the requirement elicitation phase.
- ❌ Full Spiral overhead (formal risk analysis documents per spiral) is excessive for a single-developer project.
- ✅ **Risk checkpoints** from the Spiral Model can be incorporated into an Agile approach.

---

## 5. Agile Model

### 5.1 Working Principle

Agile is an **iterative, collaborative** approach that emphasizes working software, customer feedback, and adaptability. Work is organized into short cycles called **sprints** (typically 1–4 weeks), each producing a potentially shippable increment.

**Core principles (from the Agile Manifesto, 2001):**

1. Individuals and interactions over processes and tools.
2. Working software over comprehensive documentation.
3. Customer collaboration over contract negotiation.
4. Responding to change over following a plan.

```
Sprint 1 → Sprint 2 → Sprint 3 → ... → Sprint N → Release
  │           │           │                  │
  ▼           ▼           ▼                  ▼
Plan → Build → Test → Review → Retrospect → Next Sprint
```

### 5.2 Advantages

| Advantage | Explanation |
|-----------|-------------|
| Adaptability | Requirements can change between sprints |
| Continuous delivery | Working software after every sprint |
| Feedback-driven | Regular stakeholder review and course correction |
| Quality focus | Testing integrated into every sprint |
| Transparency | Daily standups, sprint reviews, backlogs provide visibility |
| Motivation | Tangible progress in every sprint |

### 5.3 Disadvantages

| Disadvantage | Explanation |
|-------------|-------------|
| Documentation may suffer | Agile prioritizes working software; academic projects need extensive docs |
| Scope management | Without discipline, scope can expand indefinitely |
| Requires active collaboration | Needs engaged stakeholders for feedback |
| Less predictable | Final scope and timeline may be uncertain |
| Challenging for single developer | Some ceremonies (standups, pair programming) require teams |

### 5.4 Suitability for SPMS

**Rating: HIGHLY SUITABLE** ✅ (with adaptations)

- ✅ Year-long timeline benefits from iterative delivery and regular feedback.
- ✅ Requirements will evolve based on prototype feedback and stakeholder input.
- ✅ Sprint structure aligns with academic lab session cadence.
- ⚠️ Documentation emphasis must be maintained (academic requirement) — addressed by treating documentation as a sprint deliverable.
- ⚠️ Single-developer — team ceremonies adapted to self-management with progress tracking.

---

## 6. Model Comparison Matrix

| Criterion | Waterfall | Incremental | Spiral | Agile |
|-----------|-----------|-------------|--------|-------|
| **Flexibility** | Low | Medium | High | High |
| **Risk management** | Low | Medium | High | Medium |
| **Early delivery** | No | Yes | Yes | Yes |
| **Documentation** | Extensive | Moderate | Extensive | Lean (adapted) |
| **User feedback** | Late | After each increment | Each spiral | Every sprint |
| **Complexity** | Low | Medium | High | Low–Medium |
| **Single developer** | Suitable | Suitable | Complex | Suitable (adapted) |
| **Changing requirements** | Poor | Good | Excellent | Excellent |
| **Academic projects** | Traditional fit | Good fit | Overhead | Excellent fit |

---

## 7. Selected Approach: Agile with Incremental Delivery and Spiral Risk Checkpoints

### 7.1 Rationale

SPMS will use **Agile methodology** as the primary process model, augmented with:

1. **Incremental delivery** — modules are developed and deployed in sequence, each producing a working subset.
2. **Spiral risk checkpoints** — at the start of each major phase, identify and mitigate risks before proceeding.
3. **Waterfall-level documentation** — documentation is a first-class deliverable in every sprint (to meet academic requirements).

### 7.2 Why This Is Appropriate for SPMS

| Reason | Explanation |
|--------|-------------|
| **Year-long timeline** | Long projects need course correction; Agile sprints enable this |
| **Evolving requirements** | Stakeholder feedback from prototypes will refine requirements |
| **Academic milestones** | Sprint deliverables align with lab submission deadlines |
| **Single developer** | Adapted Agile (no standup ceremonies; sprint backlog + progress tracking) |
| **Documentation requirement** | Treated as sprint deliverables, not afterthoughts |
| **Risk awareness** | Spiral checkpoints catch issues (Atlas setup, eligibility complexity) early |

### 7.3 Sprint Structure

Each sprint (approximately 1–2 weeks of active development):

1. **Sprint Planning** — Select items from the backlog; define sprint goal.
2. **Development** — Implement features and write tests.
3. **Review** — Demonstrate working features; validate against requirements.
4. **Documentation** — Update relevant docs, progress tracker, and changelog.
5. **Retrospective** — Identify what went well and what to improve.

### 7.4 Sprint Backlog (Initial)

| Sprint | Goal | Modules |
|--------|------|---------|
| Sprint 1 | Project setup + Unit 1 documentation | Phase 0–1 |
| Sprint 2 | Requirements engineering + Unit 2 documentation | Phase 2 |
| Sprint 3 | System design + UML + Unit 3 documentation | Phase 3 |
| Sprint 4 | Database setup + backend foundation | Phase 4 + Phase 5 (part 1) |
| Sprint 5 | Auth + Student + Company modules | Phase 5 (part 2) |
| Sprint 6 | Drives + Eligibility + Applications | Phase 5 (part 3) |
| Sprint 7 | Recruitment + Results + Notifications | Phase 5 (part 4) |
| Sprint 8 | Frontend foundation + Auth + Student portal | Phase 6 (part 1) |
| Sprint 9 | Officer + Recruiter + Admin portals | Phase 6 (part 2) |
| Sprint 10 | Integration + end-to-end testing | Phase 7 |
| Sprint 11 | Testing + QA + metrics | Phase 8–9 |
| Sprint 12 | Docker + CI/CD + deployment | Phase 10–11 |
| Sprint 13 | Final polish + documentation + submission | Phase 12 |

### 7.5 Release Milestones

| Milestone | Version | Deliverables |
|-----------|---------|-------------|
| M1 — Foundation | v0.1.0 | Complete documentation (Units 1–3), database setup |
| M2 — Backend MVP | v0.2.0 | Core backend modules (auth through applications) |
| M3 — Full Backend | v0.3.0 | All backend modules with tests |
| M4 — Frontend MVP | v0.4.0 | Auth + Student portal + basic dashboards |
| M5 — Full Application | v0.5.0 | All portals, integration complete |
| M6 — Quality Release | v0.6.0 | Testing, metrics, quality reports complete |
| M7 — Deployment | v0.7.0 | Docker, CI/CD, production deployment |
| M8 — Final Release | v1.0.0 | All documentation, demo data, presentation ready |

### 7.6 Risk Checkpoints (Spiral Influence)

| Checkpoint | Phase | Key Risks | Mitigation |
|-----------|-------|-----------|------------|
| RC-1 | Before Phase 4 | MongoDB Atlas setup, connectivity | Step-by-step guided setup; test connection before proceeding |
| RC-2 | Before Phase 5 | PyMongo Async compatibility | Verify driver with simple CRUD; fallback plan documented |
| RC-3 | Before Phase 6 | Frontend-backend integration | Define API contracts early; use Swagger UI for validation |
| RC-4 | Before Phase 8 | Test infrastructure | Ensure pytest, Vitest, and CI are functional before writing test suites |
| RC-5 | Before Phase 11 | Deployment provider limitations | Evaluate free tier limits; test deployment with minimal app first |
