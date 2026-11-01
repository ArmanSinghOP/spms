# Professional Ethics — SPMS

## 1. Introduction

Software engineers have ethical responsibilities that extend beyond technical competence. The Student Placement Management System handles sensitive student data, academic records, and placement decisions that directly affect students' careers. This document outlines the ethical principles governing the development, operation, and maintenance of SPMS.

These principles are informed by:
- ACM Code of Ethics and Professional Conduct.
- IEEE Code of Ethics.
- Information Technology Act, 2000 (India).
- General data protection principles.

## 2. Ethical Principles

### 2.1 Responsible Handling of Student Data

**Principle:** Student personal and academic data must be collected, stored, and processed responsibly.

**SPMS Implementation:**

| Practice | Details |
|----------|---------|
| Data minimization | Collect only information necessary for placement management |
| Purpose limitation | Student data is used exclusively for placement activities |
| Accurate representation | Data displayed to recruiters must accurately reflect verified records |
| Secure storage | Data stored in MongoDB Atlas with encryption at rest and in transit |
| Access logging | Access to sensitive student data is logged in audit records |

**Developer Responsibility:**
- Never use real student data for testing or demonstration.
- Clearly label dummy/fictional data used during development.
- Never commit student information to version control.

---

### 2.2 Data Confidentiality

**Principle:** Sensitive information must be protected from unauthorized disclosure.

**SPMS Implementation:**

| Data Type | Confidentiality Measures |
|-----------|------------------------|
| Passwords | Hashed with Argon2; never stored in plaintext; never logged |
| CGPA and academic records | Visible only to authorized roles (placement officer, the student themselves) |
| Contact information | Not exposed in public listings; accessible only to relevant parties |
| Application status | Visible only to the student, placement officer, and relevant recruiter |
| Selection decisions | Communicated only through authorized channels within the system |
| Database credentials | Stored in `.env` files; excluded from Git; never in code or logs |

---

### 2.3 Privacy

**Principle:** Users have the right to control how their personal information is used.

**SPMS Implementation:**

| Privacy Measure | Details |
|----------------|---------|
| Profile visibility | Students control which information is visible on their profile |
| Consent | Registration requires awareness of data usage for placement purposes |
| Data access | Students can view all data the system holds about them |
| Minimal exposure | API responses include only the data necessary for the requesting role |
| No third-party sharing | Student data is not shared with external services beyond what the student consents to |

---

### 2.4 Authentication and Authorization

**Principle:** Only authorized users should access system functions appropriate to their role.

**SPMS Implementation:**

| Security Measure | Details |
|-----------------|---------|
| Role-based access control | Four distinct roles with specific permissions |
| Backend enforcement | Authorization checked on every API call, not just frontend routing |
| No self-elevation | Users cannot assign themselves admin or placement officer roles |
| Recruiter approval | Recruiter accounts must be approved by authorized personnel |
| Session management | JWT tokens with expiration; refresh token rotation |
| Admin bootstrap | Safe initial admin creation without hardcoded default passwords |

**Ethical Concern:** Misuse of administrative privileges can lead to data manipulation. The system must:
- Log all administrative actions.
- Prevent unauthorized modification of verified academic records.
- Restrict result modification to authorized personnel with audit trails.

---

### 2.5 Accuracy of Placement Records

**Principle:** Placement records must accurately reflect actual outcomes.

**SPMS Implementation:**

| Measure | Details |
|---------|---------|
| Verified academic data | Academic records verified by placement officer before use in eligibility checks |
| Immutable verified fields | Once academic data is verified, students cannot modify it without re-verification |
| Audit trail | All changes to selection-related records (shortlisting, selection, rejection) are logged |
| Transparent calculations | Analytics formulas (placement %, average package) are documented with exact denominators |
| No fabrication | System does not generate or inflate placement statistics |

---

### 2.6 Fair Treatment of Students

**Principle:** All students must be treated equitably by the system.

**SPMS Implementation:**

| Measure | Details |
|---------|---------|
| Objective eligibility | Eligibility is determined by pre-configured criteria (CGPA, branch, backlogs); no subjective filtering |
| Transparent criteria | Students can see exactly what criteria apply to each drive and why they are eligible or ineligible |
| Equal access | All eligible students receive the same notifications and access to apply |
| No hidden preferences | The system does not support secret eligibility rules or hidden candidate rankings |
| Deadline enforcement | Application deadlines are enforced consistently for all students |
| Appeal mechanism | If a student believes their eligibility was incorrectly evaluated, they can contact the placement officer |

---

### 2.7 Transparency of Eligibility Decisions

**Principle:** Students must understand why they are or are not eligible for a placement drive.

**SPMS Implementation:**

The eligibility engine provides:
1. **Individual criterion evaluation** — each criterion (CGPA, branch, backlogs) is checked independently.
2. **Clear reasoning** — "Your CGPA (6.8) is below the minimum required (7.0)."
3. **No opaque decisions** — the system never simply says "ineligible" without explanation.
4. **Consistent application** — the same criteria produce the same result for every student.

---

### 2.8 Responsible Use of Administrative Privileges

**Principle:** Administrative and placement officer accounts carry significant power and must be used responsibly.

**SPMS Safeguards:**

| Safeguard | Details |
|-----------|---------|
| Principle of least privilege | Users receive only the permissions necessary for their role |
| Admin action logging | System logs all administrative actions (user creation, role changes, drive publication) |
| No bulk unauthorized operations | Mass operations (bulk rejection, bulk verification) require explicit confirmation |
| Account deactivation | Compromised or misused accounts can be deactivated without data loss |
| Separation of duties | Where practical, sensitive operations (e.g., publishing results) are distinct from data entry operations |

---

### 2.9 Prevention of Unauthorized Modification of Results

**Principle:** Placement results are official records that must not be tampered with.

**SPMS Safeguards:**

| Safeguard | Details |
|-----------|---------|
| Authorized updates only | Result changes restricted to designated roles (placement officer, authorized recruiter) |
| Audit trail | Every result change records: who, when, what was changed, old value, new value |
| State transition rules | Invalid transitions (e.g., REJECTED → SELECTED without authorized correction) are rejected by the system |
| No silent modifications | The system does not allow result changes without creating an audit record |
| Notification on changes | Affected students are notified when their application status changes |

---

### 2.10 Ethical Handling of Dummy vs. Actual Data

**Principle:** Development and testing must use clearly distinguished dummy data; production must use verified actual data.

**SPMS Practices:**

| Practice | Details |
|----------|---------|
| **Development data** | Uses fictional companies (e.g., "TechNova Solutions", "InnoSoft Pvt. Ltd.") and fictional students |
| **Clear labeling** | Seed scripts and test fixtures are clearly marked as dummy data |
| **No real data in code** | No actual student names, emails, CGPAs, or company information appear in source code |
| **Data separation** | Development, staging, and production databases are separate; no cross-contamination |
| **Demo mode** | Demonstration uses fictional data; any real data demo requires explicit permission |
| **Data cleanup** | Seed scripts are idempotent and clearly separated from production initialization |

---

## 3. Ethical Guidelines for Development Team

### 3.1 During Development

1. **Never** commit real student data, credentials, or secrets to version control.
2. **Never** use production data for testing without explicit authorization.
3. **Always** use fictional/dummy data in demonstrations, screenshots, and documentation.
4. **Always** validate that sensitive data is not exposed in API responses, logs, or error messages.
5. **Report** any discovered security vulnerability or data exposure immediately.

### 3.2 During Deployment

1. **Never** deploy with default credentials or hardcoded secrets.
2. **Always** use environment-specific configuration (dev/staging/prod).
3. **Verify** that production logging does not expose sensitive data.
4. **Ensure** that database access is restricted to the application's IP addresses.

### 3.3 During Maintenance

1. **Maintain** the audit log system; do not disable it.
2. **Respect** data retention policies; do not keep data longer than necessary.
3. **Update** dependencies to address known security vulnerabilities.
4. **Document** any ethical decisions or trade-offs made during maintenance.

## 4. Compliance Summary

| Area | Standard/Practice | Status |
|------|-------------------|--------|
| Data protection | Encryption at rest and in transit (Atlas TLS) | Implemented |
| Access control | RBAC with backend enforcement | Implemented |
| Password security | Argon2 hashing | Implemented |
| Audit logging | Action logs with user ID and timestamp | Implemented |
| Secret management | `.env` files, Git-ignored, not in Docker images | Implemented |
| Dummy data | Clearly labeled fictional data for development | Implemented |
| Eligibility transparency | Individual criterion evaluation with explanations | Implemented |
| Result integrity | State transition validation + audit trail | Implemented |
