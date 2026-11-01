from typing import Dict, Any, List
from app.schemas.drive import EligibilityCheckResult

def check_student_eligibility(student_profile: Dict[str, Any], criteria: Dict[str, Any]) -> EligibilityCheckResult:
    """
    Evaluates student academic profile against drive eligibility criteria.
    Returns boolean and clear, actionable reasons if ineligible.
    """
    reasons: List[str] = []

    # 1. CGPA Check
    student_cgpa = float(student_profile.get("cgpa", 0.0) or 0.0)
    min_cgpa = float(criteria.get("min_cgpa", 0.0) or 0.0)
    if student_cgpa < min_cgpa:
        reasons.append(f"Current CGPA ({student_cgpa:.2f}) is below the required {min_cgpa:.2f}")

    # 2. 10th Standard Percentage
    student_10th = float(student_profile.get("tenth_percentage", 0.0) or 0.0)
    min_10th = float(criteria.get("min_tenth_percentage", 0.0) or 0.0)
    if student_10th < min_10th:
        reasons.append(f"10th Grade percentage ({student_10th:.1f}%) is below the minimum required {min_10th:.1f}%")

    # 3. 12th Standard Percentage
    student_12th = float(student_profile.get("twelfth_percentage", 0.0) or 0.0)
    min_12th = float(criteria.get("min_twelfth_percentage", 0.0) or 0.0)
    if student_12th < min_12th:
        reasons.append(f"12th Grade percentage ({student_12th:.1f}%) is below the minimum required {min_12th:.1f}%")

    # 4. Active Backlogs
    student_active_backlogs = int(student_profile.get("active_backlogs", 0) or 0)
    max_active = int(criteria.get("max_active_backlogs", 0) or 0)
    if student_active_backlogs > max_active:
        reasons.append(f"Active backlogs ({student_active_backlogs}) exceeds the maximum allowed ({max_active})")

    # 5. History Backlogs
    student_history_backlogs = int(student_profile.get("history_backlogs", 0) or 0)
    max_history = int(criteria.get("max_history_backlogs", 10) or 10)
    if student_history_backlogs > max_history:
        reasons.append(f"Total backlog history ({student_history_backlogs}) exceeds the maximum limit ({max_history})")

    # 6. Department / Branch Check
    student_dept = str(student_profile.get("department", "")).strip().upper()
    allowed_depts = [str(d).strip().upper() for d in criteria.get("allowed_departments", [])]
    if allowed_depts and student_dept not in allowed_depts:
        reasons.append(f"Department '{student_dept}' is not eligible for this drive (Eligible: {', '.join(allowed_depts)})")

    # 7. Batch Check
    student_batch = int(student_profile.get("batch", 0) or 0)
    allowed_batches = criteria.get("allowed_batches", [])
    if allowed_batches and student_batch not in allowed_batches:
        reasons.append(f"Batch ({student_batch}) is not in eligible batches ({', '.join(map(str, allowed_batches))})")

    # 8. Placement Status (Single offer / Dream policy)
    allow_already_placed = criteria.get("allow_already_placed", False)
    student_status = student_profile.get("placement_status", "unplaced")
    if not allow_already_placed and student_status == "placed":
        reasons.append("Student is already placed and this drive does not permit multiple offers (Dream policy restricted)")

    is_eligible = len(reasons) == 0
    return EligibilityCheckResult(eligible=is_eligible, reasons=reasons)
