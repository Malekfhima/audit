import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, Users as UsersIcon, Shield, Mail, User } from 'lucide-react';

interface AppUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/users', { params });
      setUsers(response.data.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, string> = {
      ADMIN: 'badge-danger', MANAGER: 'badge-warning',
      AUDITOR: 'badge-info', USER: 'badge-neutral',
    };
    return <span className={map[role] || 'badge-neutral'}>{role}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage system users and their roles</p>
        </div>
        <button onClick={() => navigate('/users/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Add User
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search users..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <button onClick={fetchUsers} className="btn-primary">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <UsersIcon className="empty-state-icon" />
            <h3 className="empty-state-title">No users found</h3>
            <p className="empty-state-text">Add team members to the system.</p>
            <button onClick={() => navigate('/users/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Add User
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{user.email}</span></td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <span className={user.isActive ? 'badge-success' : 'badge-danger'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn-ghost btn-sm">Edit</button>
                      <button className="btn-ghost btn-sm text-red-500 hover:text-red-700">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
