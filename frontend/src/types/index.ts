export type UserRole = 
  | 'STUDENT' 
  | 'PLACEMENT_OFFICER' 
  | 'RECRUITER' 
  | 'ADMIN'
  | 'student' 
  | 'tpo' 
  | 'admin' 
  | 'recruiter';

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  tier: string;
  location: string;
  description?: string;
  active_drives_count: number;
  total_hires_count: number;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  roll_number: string;
  department: string;
  batch: number;
  cgpa: number;
  tenth_percentage: number;
  twelfth_percentage: number;
  active_backlogs: number;
  history_backlogs: number;
  skills: string[];
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  placement_status: 'unplaced' | 'placed' | 'opted_out';
  offers_count: number;
  full_name?: string;
  email?: string;
  phone?: string;
}

export interface DriveRound {
  round_number: number;
  name: string;
  description?: string;
}

export interface EligibilityCriteria {
  min_cgpa: number;
  min_tenth_percentage: number;
  min_twelfth_percentage: number;
  max_active_backlogs: number;
  max_history_backlogs: number;
  allowed_departments: string[];
  allowed_batches: number[];
  allow_already_placed: boolean;
}

export interface EligibilityCheckResult {
  eligible: boolean;
  reasons: string[];
}

export interface Drive {
  id: string;
  title: string;
  company_name: string;
  job_role: string;
  job_description: string;
  package_ctc: number;
  stipend?: string;
  job_location: string;
  drive_date: string;
  application_deadline: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  eligibility_criteria: EligibilityCriteria;
  rounds: DriveRound[];
  total_applicants?: number;
  user_eligibility?: EligibilityCheckResult;
  has_applied?: boolean;
  application_status?: string;
  created_at: string;
}

export interface RoundHistoryEntry {
  round_name: string;
  status: string;
  remarks?: string;
  updated_at: string;
}

export interface Application {
  id: string;
  drive_id: string;
  student_id: string;
  student_user_id?: string;
  student_name?: string;
  student_roll?: string;
  student_department?: string;
  student_cgpa?: number;
  student_email?: string;
  student_resume_url?: string;
  company_name?: string;
  drive_title?: string;
  job_role?: string;
  package_ctc?: number;
  status: string;
  current_round: number;
  round_history: RoundHistoryEntry[];
  applied_at: string;
  updated_at?: string;
}

export interface DepartmentStat {
  department: string;
  total_students: number;
  placed_students: number;
  placement_rate: number;
  average_ctc: number;
}

export interface TPODashboardStats {
  total_students: number;
  placed_students: number;
  unplaced_students: number;
  placement_percentage: number;
  total_drives: number;
  active_drives: number;
  total_offers: number;
  highest_package_lpa: number;
  average_package_lpa: number;
  department_stats: DepartmentStat[];
}

export interface StudentDashboardStats {
  total_active_drives: number;
  eligible_drives_count: number;
  applied_count: number;
  shortlisted_count: number;
  offers_count: number;
  placement_status: string;
  cgpa: number;
  department: string;
}
