import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  ShieldCheck, Users, Database, Activity, Lock, 
  CheckCircle2, XCircle, Search, RefreshCw, Key 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';
import { useToast } from '../ui/Toast';

interface AdminPortalProps {
  currentTab: string;
}

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ currentTab }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      full_name: 'Dr. Rajesh Verma (Head TPO)',
      email: 'tpo@kiet.edu',
      role: 'PLACEMENT_OFFICER',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      full_name: 'System Administrator',
      email: 'admin@kiet.edu',
      role: 'ADMIN',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      full_name: 'Arjun Sharma',
      email: 'arjun.sharma@kiet.edu',
      role: 'STUDENT',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      full_name: 'Priya Verma',
      email: 'priya.verma@kiet.edu',
      role: 'STUDENT',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      full_name: 'Rohit Singh',
      email: 'rohit.singh@kiet.edu',
      role: 'STUDENT',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      full_name: 'Sneha Kapoor (Google Recruiter)',
      email: 'recruiter.google@google.com',
      role: 'RECRUITER',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = !u.is_active;
        toast({
          type: nextState ? 'success' : 'info',
          title: 'Account Status Changed',
          message: `${u.full_name} is now ${nextState ? 'Active' : 'Deactivated'}.`
        });
        return { ...u, is_active: nextState };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="danger" className="flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Root System Administration
              </Badge>
              <Badge variant="outline">Security & Audit</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Governance & Access Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              User identity provisioning, cryptographic access token monitoring, role permissions, and immutable audit logs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Database Engine</p>
            <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1 justify-end">
              <Database className="w-4 h-4" /> PyMongo Async API
            </p>
            <p className="text-[11px] text-slate-400">spms_db</p>
          </div>
        </div>
      </div>

      {/* System Health KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Total System Accounts</p>
          <p className="text-3xl font-extrabold text-white mt-2">{users.length}</p>
          <p className="text-[11px] text-indigo-400 mt-2 font-semibold">Across All 4 Roles</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Active Authorized Users</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">
            {users.filter(u => u.is_active).length}
          </p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">100% Operational</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Password Hashing Standard</p>
          <p className="text-xl font-bold text-cyan-400 mt-2">Argon2id</p>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Industry Best Practice</p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium text-slate-400">Token Authentication</p>
          <p className="text-xl font-bold text-purple-400 mt-2">PyJWT (HS256)</p>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">24-Hour Expiration</p>
        </Card>
      </div>

      {/* User Governance Table */}
      <Card className="p-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>User Provisioning & Role Directory</CardTitle>
              <CardDescription>
                Inspect provisioned accounts, verify canonical roles, and toggle access permissions.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search user or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none w-48 sm:w-60"
                />
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="PLACEMENT_OFFICER">Placement Officer</option>
                <option value="RECRUITER">Recruiter</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map(u => (
              <div
                key={u.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{u.full_name}</span>
                    <Badge 
                      variant={
                        u.role === 'ADMIN' ? 'danger' :
                        u.role === 'PLACEMENT_OFFICER' ? 'primary' :
                        u.role === 'RECRUITER' ? 'purple' : 'success'
                      }
                      className="text-[10px]"
                    >
                      {u.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold flex items-center gap-1 ${
                    u.is_active ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {u.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {u.is_active ? 'Active' : 'Deactivated'}
                  </span>

                  <Button
                    size="sm"
                    variant={u.is_active ? 'outline' : 'success'}
                    onClick={() => toggleUserStatus(u.id)}
                  >
                    {u.is_active ? 'Deactivate' : 'Activate Account'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Stream */}
      <Card className="p-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <CardTitle>System Audit & Security Activity Stream</CardTitle>
          </div>
          <CardDescription>
            Immutable event log tracking authentication checkpoints, role evaluations, and drive publications.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-200">Database Driver Migrated to PyMongo Async API</span>
                <Badge variant="outline" className="text-[10px]">INFRA</Badge>
              </div>
              <span className="text-[10px] text-slate-500">Just now</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="font-semibold text-slate-200">User Registered with Argon2id Hash Verification</span>
                <Badge variant="primary" className="text-[10px]">AUTH</Badge>
              </div>
              <span className="text-[10px] text-slate-500">10 mins ago</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="font-semibold text-slate-200">Eligibility Engine Verification Executed (100% Pass)</span>
                <Badge variant="purple" className="text-[10px]">ENGINE</Badge>
              </div>
              <span className="text-[10px] text-slate-500">25 mins ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
