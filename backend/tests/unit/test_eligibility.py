from app.services.eligibility_service import check_student_eligibility

def test_student_eligible_all_criteria_met():
    student = {
        "cgpa": 8.5,
        "tenth_percentage": 85.0,
        "twelfth_percentage": 82.0,
        "active_backlogs": 0,
        "history_backlogs": 0,
        "department": "CSE",
        "batch": 2025,
        "placement_status": "unplaced"
    }
    criteria = {
        "min_cgpa": 7.5,
        "min_tenth_percentage": 75.0,
        "min_twelfth_percentage": 75.0,
        "max_active_backlogs": 0,
        "max_history_backlogs": 1,
        "allowed_departments": ["CSE", "IT"],
        "allowed_batches": [2025],
        "allow_already_placed": False
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is True
    assert len(result.reasons) == 0

def test_student_ineligible_low_cgpa():
    student = {
        "cgpa": 6.8,
        "tenth_percentage": 85.0,
        "twelfth_percentage": 82.0,
        "active_backlogs": 0,
        "department": "CSE",
        "batch": 2025
    }
    criteria = {
        "min_cgpa": 7.5,
        "allowed_departments": ["CSE"],
        "allowed_batches": [2025]
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("CGPA" in r for r in result.reasons)

def test_student_ineligible_department_mismatch():
    student = {
        "cgpa": 8.0,
        "tenth_percentage": 85.0,
        "twelfth_percentage": 82.0,
        "active_backlogs": 0,
        "department": "ME",
        "batch": 2025
    }
    criteria = {
        "min_cgpa": 7.0,
        "allowed_departments": ["CSE", "IT", "CSIT"],
        "allowed_batches": [2025]
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("Department 'ME' is not eligible" in r for r in result.reasons)

def test_student_ineligible_active_backlogs():
    student = {
        "cgpa": 8.0,
        "active_backlogs": 2,
        "department": "CSE",
        "batch": 2025
    }
    criteria = {
        "min_cgpa": 7.0,
        "max_active_backlogs": 0,
        "allowed_departments": ["CSE"],
        "allowed_batches": [2025]
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("Active backlogs (2) exceeds" in r for r in result.reasons)
