# Comprehensive Security Audit Report

**Project**: Student Placement Management System (SPMS)  
**Target Repository**: `https://github.com/ArmanSinghOP/spms`  
**Audit Date**: 2026-11-01  
**Audit Scope**: Entire repository (Backend, Frontend, Configuration, Git Commit History, Environment templates)  
**Tooling**: Gitleaks v8.18.2, Ripgrep, Pytest Security Suite, Detect-Secrets  

---

## 1. Executive Summary

Following a MongoDB Atlas security notification regarding public credential exposure, a full security audit of the SPMS repository was executed. The notification identified that database connection credentials were exposed in public commits (`1c031db4cb3a54c48d09f53a85adfc57a4a35052` and `b52b1f7e63f0917fb96882d6ef32d043e87db62d`).

The project owner immediately completed manual credential rotation:
1. Changed MongoDB Atlas password for user `spms_app_user`.
2. Generated a new cryptographically secure JWT signing secret.
3. Updated the local `backend/.env` file.

This audit evaluates the codebase and history to confirm remediation, identify remaining risks, and verify preventative guardrails.

---

## 2. Security Findings & Risk Classification

### Finding 1: Hardcoded MongoDB Connection URI in Application Configuration
- **Affected File**: `backend/app/core/config.py`
- **Affected Historical Commits**: `1c031db4cb3a54c48d09f53a85adfc57a4a35052`
- **CWE**: CWE-798 (Use of Hard-coded Credentials)
- **Risk Classification**: **CRITICAL** (Remediated)
- **Description**: `Settings.MONGODB_URL` contained a default fallback value with live MongoDB Atlas connection credentials (`mongodb+srv://spms_app_user:****@spms-cluster.wvdtyx7.mongodb.net/?retryWrites=true&w=majority`).
- **Remediation Status**: **RESOLVED**. `config.py` refactored using Pydantic Settings. `MONGODB_URL` is now mandatory from the environment (`backend/.env`). No default fallback exists. Validation blocks startup if compromised patterns or placeholders are detected.

### Finding 2: Hardcoded Production JWT Signing Secret
- **Affected Files**: `backend/app/core/config.py`, `backend/.env.example`
- **Affected Historical Commits**: `b52b1f7e63f0917fb96882d6ef32d043e87db62d`, `1c031db4cb3a54c48d09f53a85adfc57a4a35052`
- **CWE**: CWE-321 (Use of Hard-coded Cryptographic Key)
- **Risk Classification**: **CRITICAL** (Remediated)
- **Description**: Default JWT signing secret was hardcoded into source code and environment templates.
- **Remediation Status**: **RESOLVED**. Mandatory loading from `backend/.env`. `Settings` enforces minimum 32-character length and explicitly rejects the known compromised key and placeholders.

### Finding 3: Cleartext Credential Logging in Database Manager
- **Affected File**: `backend/app/core/database.py`
- **Affected Historical Commits**: `1c031db4cb3a54c48d09f53a85adfc57a4a35052`
- **CWE**: CWE-532 (Insertion of Sensitive Information into Log File)
- **Risk Classification**: **HIGH** (Remediated)
- **Description**: `logger.info(f"Connecting to MongoDB with PyMongo Async API at {target_url}...")` logged raw connection strings containing database passwords to application logs.
- **Remediation Status**: **RESOLVED**. Implemented `sanitize_mongo_uri()` function masking username and password (`mongodb+srv://***:***@...`).

### Finding 4: Insecure Credentialed Wildcard CORS Configuration
- **Affected File**: `backend/app/core/config.py`, `backend/app/main.py`
- **Affected Historical Commits**: `b52b1f7e63f0917fb96882d6ef32d043e87db62d`, `1c031db4cb3a54c48d09f53a85adfc57a4a35052`
- **CWE**: CWE-942 (Permissive Cross-Domain Policy with Untrusted Domains)
- **Risk Classification**: **HIGH** (Remediated)
- **Description**: `BACKEND_CORS_ORIGINS` included `"*"` while FastAPI `CORSMiddleware` was set to `allow_credentials=True`. This violates modern browser security standards and allows unauthorized cross-origin credentialed requests.
- **Remediation Status**: **RESOLVED**. Wildcard `"*"` removed. `BACKEND_CORS_ORIGINS` explicitly restricted to approved development origins (`http://localhost:5173`, `http://127.0.0.1:5173`). Settings validator actively purges `*` if supplied.

### Finding 5: Leaked Secrets in `.env.example`
- **Affected File**: `backend/.env.example`
- **Affected Historical Commits**: `1c031db4cb3a54c48d09f53a85adfc57a4a35052`
- **CWE**: CWE-540 (Inclusion of Sensitive Information in Source Code)
- **Risk Classification**: **HIGH** (Remediated)
- **Description**: The template file contained the live MongoDB connection URI and the compromised JWT secret.
- **Remediation Status**: **RESOLVED**. Replaced with generic placeholders (`<db_username>`, `<db_password>`, `<cluster-url>`).

### Finding 6: Silent Fallback to Local MongoDB
- **Affected File**: `backend/app/core/database.py`
- **Affected Historical Commits**: `1c031db4cb3a54c48d09f53a85adfc57a4a35052`
- **CWE**: CWE-391 (Unchecked Error Condition)
- **Risk Classification**: **MEDIUM** (Remediated)
- **Description**: When Atlas authentication failed, `database.py` silently caught the exception and connected to `mongodb://localhost:27017`, masking connection failures and leaking test data locally.
- **Remediation Status**: **RESOLVED**. Local fallback eliminated. Connection failure fails fast and reports sanitized error diagnostics.

### Finding 7: Unrestricted Demo Data Seeding in Production Code
- **Affected File**: `backend/app/core/seeder.py`
- **Affected Historical Commits**: `b52b1f7e63f0917fb96882d6ef32d043e87db62d`
- **CWE**: CWE-1188 (Insecure Default Initialization of Resource)
- **Risk Classification**: **MEDIUM** (Remediated)
- **Description**: Demo seeding was invoked on every startup during lifespan, with hardcoded default passwords.
- **Remediation Status**: **RESOLVED**. Seeder now checks `settings.ENVIRONMENT` and aborts if `production`. Demo passwords are dynamically sourced from environment settings.

---

## 3. Secret Scanner Results (Redacted)

### A. Current Source Scan (Gitleaks v8.18.2)
- Target: `d:\placement_project`
- Scan Mode: `--no-git`
- Scope: Backend, Frontend, Configuration files
- **Findings in Active Source Code**: **0 (CLEAN)**
- Notes:
  - Untracked local `backend/.env` is ignored by `.gitignore` and protected locally.
  - Test vectors inside `.venv` third-party packages were identified and confirmed non-project dependencies.

### B. Git History Scan
- Total Commits: 3 (`6839796`, `b52b1f7`, `1c031db`)
- Commit `6839796`: **CLEAN** (Documentation and project skeleton only)
- Commit `b52b1f7`: Contains historical hardcoded JWT secret in `config.py`
- Commit `1c031db`: Contains historical hardcoded MongoDB URI and JWT secret in `config.py`, `.env.example`, `database.py`
- **Status**: History rewriting required in Phase 5 to remove historical references.

---

## 4. Remaining Concerns & Recommendations

1. **Remote Git History**: Even after local history rewriting via `git-filter-repo`, remote GitHub references on `origin/main` and `origin/master` retain the old commits until an authorized push occurs.
2. **GitHub Cached Commits & Forks**: GitHub may retain unreferenced loose commits in its cache for up to 90 days or until garbage collected. Users with cloned forks must rebase or fetch fresh clones.
3. **Atlas Auditing**: Free/M0 cluster tiers do not provide detailed historical database audit logs; any cluster activities prior to password rotation should be assumed unauthenticated. Password rotation has effectively eliminated active exposure.
