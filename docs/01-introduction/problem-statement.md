# Problem Statement — Student Placement Management System

## 1. Context

Campus placement is one of the most critical activities in an engineering college. At **KIET Group of Institutions**, the placement cell coordinates between hundreds of students across 9 departments and multiple recruiting companies each academic year. The existing process relies heavily on manual methods, leading to significant inefficiencies.

## 2. Current Placement Management Challenges

### 2.1 Manual Data Management

**Problem:** Student information (academic records, contact details, skills, resumes) is collected through Google Forms and maintained in spreadsheets.

**Consequences:**
- Multiple versions of student data exist across different spreadsheets.
- Data entry errors go undetected until they affect eligibility decisions.
- No single source of truth for a student's current academic standing.
- Updating information requires re-submission or manual editing by staff.
- No structured way to track profile completeness.

### 2.2 Eligibility Verification Difficulties

**Problem:** Eligibility criteria (minimum CGPA, allowed branches, backlog limits) are checked manually by filtering spreadsheets.

**Consequences:**
- Time-consuming process repeated for every drive.
- Risk of human error — eligible students may be excluded or ineligible students included.
- Students lack visibility into why they are ineligible for a particular drive.
- No standardized, repeatable eligibility engine.
- Changes in criteria require re-filtering the entire dataset.

### 2.3 Communication Problems

**Problem:** Placement announcements, schedules, and results are communicated via WhatsApp groups, email, and notice boards.

**Consequences:**
- Important messages are lost in chat history.
- No confirmation that a student has received or read a notification.
- Students in different branches may receive information at different times.
- No centralized notification history or audit trail.
- Urgent schedule changes may not reach all affected students.

### 2.4 Application Tracking Problems

**Problem:** Applications are collected through separate Google Forms for each drive, with no unified tracking.

**Consequences:**
- Duplicate applications cannot be automatically detected.
- Application status (applied, shortlisted, selected, rejected) is not tracked in real time.
- Students have no self-service way to view their application history.
- Correlating a student's application across multiple drives requires manual cross-referencing.
- Application deadlines are enforced only by opening/closing the form manually.

### 2.5 Result Management Problems

**Problem:** Selection results are communicated informally and compiled manually.

**Consequences:**
- Results may be announced inconsistently across channels.
- No structured record of which candidates were shortlisted, selected, or rejected at each round.
- Offer details (package, location, role) are not centrally stored.
- Historical placement data is difficult to retrieve for accreditation or reporting.
- No audit trail for who made selection decisions or when.

### 2.6 Reporting Difficulties

**Problem:** Placement statistics (placement percentage, average package, company-wise breakdown) are calculated manually in Excel.

**Consequences:**
- Reports are generated only on demand, with significant delay.
- Different reports may use different denominators (all students vs. registered students vs. eligible students), leading to inconsistent statistics.
- Department-wise, company-wise, and trend analysis requires manual effort.
- Real-time dashboards do not exist.
- CSV/PDF export for official reporting is not available.

## 3. Precise Problem Statement

> **There is no centralized, integrated system at KIET Group of Institutions to manage the end-to-end campus placement process — from student registration and profile verification, through company management and placement drive creation, to eligibility checking, application handling, multi-round recruitment, result publication, and placement analytics.**
>
> **The current process relies on disconnected tools (spreadsheets, Google Forms, WhatsApp, email) that are manual, error-prone, lack access control, provide no real-time tracking, and cannot produce reliable placement statistics without significant manual effort.**
>
> **The proposed Student Placement Management System (SPMS) will address these challenges by providing a role-based, web-based platform that automates eligibility verification, enforces application rules, tracks recruitment progress, and delivers real-time analytics — while maintaining data integrity, security, and auditability.**

## 4. Problem Scope

### In Scope
- Student registration and profile management.
- Academic information management with verification workflow.
- Company and recruiter management.
- Placement drive creation with configurable eligibility criteria.
- Automated eligibility engine with transparent decision explanations.
- Application submission with duplicate prevention and deadline enforcement.
- Multi-round recruitment management.
- Result and offer tracking.
- In-app notification system.
- Placement analytics and reporting with CSV export.
- Role-based access control (Student, Placement Officer, Recruiter, Admin).

### Out of Scope (Initial Release)
- Email/SMS notification integration (planned for future).
- Payment or fee management.
- Alumni tracking beyond graduation year.
- Integration with external university ERP systems.
- Mobile native application (responsive web is in scope).
- AI-based candidate matching or recommendation.

## 5. Success Criteria

| Criterion | Measurable Target |
|-----------|-------------------|
| All 4 user roles functional | Each role can perform its designated operations |
| Eligibility engine accuracy | 100% match with manual verification on test data |
| Duplicate application prevention | Zero duplicate applications in database |
| Real-time analytics | Dashboard loads within 3 seconds |
| Application tracking | Students can view status of all their applications |
| Audit trail | All selection-related actions are logged with timestamp and user |
| Documentation completeness | All 5 units of SE syllabus covered with artifacts |
| Test coverage | ≥70% overall, ≥80% for critical business logic |
