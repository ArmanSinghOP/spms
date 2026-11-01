import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (roleKey: 'tpo' | 'admin' | 'arjun' | 'priya' | 'rohit' | 'recruiter') => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const initAuth = async () => {
    const token = localStorage.getItem('spms_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      if (data.student_profile) {
        setStudentProfile(data.student_profile);
      }
    } catch (err) {
      console.warn("Session restore failed, clearing token", err);
      api.clearToken();
      setUser(null);
      setStudentProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      api.setToken(res.access_token);
      setUser(res.user);
      const isStudent = res.user.role.toUpperCase() === 'STUDENT';
      if (isStudent) {
        try {
          const prof = await api.getMyStudentProfile();
          setStudentProfile(prof);
        } catch {
          // Profile might be empty
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (roleKey: 'tpo' | 'admin' | 'arjun' | 'priya' | 'rohit' | 'recruiter') => {
    const credentialsMap = {
      tpo: { email: 'tpo@kiet.edu', pass: 'Admin@123' },
      admin: { email: 'admin@kiet.edu', pass: 'Admin@123' },
      arjun: { email: 'arjun.sharma@kiet.edu', pass: 'Student@123' },
      priya: { email: 'priya.verma@kiet.edu', pass: 'Student@123' },
      rohit: { email: 'rohit.singh@kiet.edu', pass: 'Student@123' },
      recruiter: { email: 'recruiter.google@google.com', pass: 'Recruiter@123' },
    };

    const creds = credentialsMap[roleKey];
    if (creds) {
      await login(creds.email, creds.pass);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      api.setToken(res.access_token);
      setUser(res.user);
      if (res.user.role === 'student') {
        const prof = await api.getMyStudentProfile();
        setStudentProfile(prof);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    setStudentProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      if (user.role === 'student') {
        const prof = await api.getMyStudentProfile();
        setStudentProfile(prof);
      }
      const meData = await api.getMe();
      setUser(meData.user);
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        loading,
        login,
        loginDemo,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
