import pytest
from app.services.eligibility_service import check_student_eligibility

def test_student_ineligible_10th_percentage():
    student = {
        "cgpa": 8.5,
        "tenth_percentage": 68.0,
        "twelfth_percentage": 82.0,
        "active_backlogs": 0,
        "department": "CSE",
        "batch": 2025
    }
    criteria = {
        "min_cgpa": 7.5,
        "min_tenth_percentage": 75.0,
        "allowed_departments": ["CSE"],
        "allowed_batches": [2025]
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("10th Grade percentage (68.0%) is below the minimum required 75.0%" in r for r in result.reasons)

def test_student_ineligible_12th_percentage():
    student = {
        "cgpa": 8.5,
        "tenth_percentage": 80.0,
        "twelfth_percentage": 65.0,
        "active_backlogs": 0,
        "department": "CSE",
        "batch": 2025
    }
    criteria = {
        "min_cgpa": 7.5,
        "min_twelfth_percentage": 75.0,
        "allowed_departments": ["CSE"],
        "allowed_batches": [2025]
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("12th Grade percentage (65.0%) is below the minimum required 75.0%" in r for r in result.reasons)

def test_student_ineligible_history_backlogs():
    student = {
        "cgpa": 8.5,
        "tenth_percentage": 80.0,
        "twelfth_percentage": 80.0,
        "active_backlogs": 0,
        "history_backlogs": 3,
        "department": "CSE",
        "batch": 2025
    }
    criteria = {
        "min_cgpa": 7.5,
        "max_history_backlogs": 1,
        "allowed_departments": ["CSE"],
        "allowed_batches": [2025]
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("Total backlog history (3) exceeds the maximum limit (1)" in r for r in result.reasons)

def test_student_ineligible_batch_mismatch():
    student = {
        "cgpa": 8.5,
        "tenth_percentage": 80.0,
        "twelfth_percentage": 80.0,
        "active_backlogs": 0,
        "department": "CSE",
        "batch": 2024
    }
    criteria = {
        "min_cgpa": 7.0,
        "allowed_departments": ["CSE"],
        "allowed_batches": [2025, 2026]
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("Batch (2024) is not in eligible batches" in r for r in result.reasons)

def test_student_already_placed_disallowed():
    student = {
        "cgpa": 8.5,
        "tenth_percentage": 80.0,
        "twelfth_percentage": 80.0,
        "active_backlogs": 0,
        "department": "CSE",
        "batch": 2025,
        "placement_status": "placed"
    }
    criteria = {
        "min_cgpa": 7.0,
        "allowed_departments": ["CSE"],
        "allowed_batches": [2025],
        "allow_already_placed": False
    }
    result = check_student_eligibility(student, criteria)
    assert result.eligible is False
    assert any("Student is already placed and this drive does not permit multiple offers" in r for r in result.reasons)
