import { 
  User, StudentProfile, Drive, Application, 
  TPODashboardStats, StudentDashboardStats 
} from '../types';

const API_BASE = '/api/v1';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('spms_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('spms_token', token);
  }

  public clearToken(): void {
    localStorage.removeItem('spms_token');
    localStorage.removeItem('spms_user');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      // Optional trigger for auth logout
    }

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // --- Auth Endpoints ---
  async login(credentials: { email: string; password: string }) {
    return this.request<{ access_token: string; token_type: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: any) {
    return this.request<{ access_token: string; token_type: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<{ user: User; student_profile?: StudentProfile }>('/auth/me');
  }

  // --- Student Endpoints ---
  async getMyStudentProfile() {
    return this.request<StudentProfile>('/students/me');
  }

  async updateMyStudentProfile(data: Partial<StudentProfile>) {
    return this.request<StudentProfile>('/students/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadResume(file: File) {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/students/me/resume`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Resume upload failed');
    }

    return response.json();
  }

  async listStudents(params?: { department?: string; batch?: number; placement_status?: string; min_cgpa?: number; search?: string }) {
    const query = new URLSearchParams();
    if (params?.department) query.append('department', params.department);
    if (params?.batch) query.append('batch', params.batch.toString());
    if (params?.placement_status) query.append('placement_status', params.placement_status);
    if (params?.min_cgpa !== undefined) query.append('min_cgpa', params.min_cgpa.toString());
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    return this.request<StudentProfile[]>(`/students/${queryString ? `?${queryString}` : ''}`);
  }

  // --- Drives Endpoints ---
  async listDrives(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<Drive[]>(`/drives/${query}`);
  }

  async getDrive(id: string) {
    return this.request<Drive>(`/drives/${id}`);
  }

  async createDrive(data: any) {
    return this.request<Drive>('/drives/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDrive(id: string, data: any) {
    return this.request<Drive>(`/drives/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDrive(id: string) {
    return this.request<{ message: string }>(`/drives/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Applications Endpoints ---
  async applyToDrive(driveId: string) {
    return this.request<Application>('/applications/', {
      method: 'POST',
      body: JSON.stringify({ drive_id: driveId }),
    });
  }

  async getMyApplications() {
    return this.request<Application[]>('/applications/my');
  }

  async getDriveApplicants(driveId: string, statusFilter?: string) {
    const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    return this.request<Application[]>(`/applications/drive/${driveId}${query}`);
  }

  async updateApplicationStatus(applicationId: string, data: { status: string; round_name?: string; remarks?: string; current_round?: number }) {
    return this.request<{ message: string; status: string }>(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Analytics Endpoints ---
  async getTPOStats() {
    return this.request<TPODashboardStats>('/analytics/tpo');
  }

  async getStudentStats() {
    return this.request<StudentDashboardStats>('/analytics/student');
  }
}

export const api = new ApiClient();
