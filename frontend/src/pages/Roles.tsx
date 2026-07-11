import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Shield } from 'lucide-react';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: string;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const getPermissionColor = (perm: string) => {
    const colors: Record<string, string> = {
      'read': 'bg-blue-100 text-blue-700',
      'write': 'bg-emerald-100 text-emerald-700',
      'delete': 'bg-red-100 text-red-700',
      'admin': 'bg-purple-100 text-purple-700',
    };
    const key = Object.keys(colors).find(k => perm.toLowerCase().includes(k));
    return key ? colors[key] : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Roles & Permissions</h1>
          <p className="page-subtitle">Define roles and access permissions</p>
        </div>
        <button onClick={() => navigate('/roles/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Role
        </button>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 w-full" />)}
        </div>
      ) : roles.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Shield className="empty-state-icon" />
            <h3 className="empty-state-title">No roles found</h3>
            <p className="empty-state-text">Create roles to manage user permissions.</p>
            <button onClick={() => navigate('/roles/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Add Role
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role._id} className="card hover:shadow-lg transition-all duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  {role.isSystemRole && (
                    <span className="badge-info text-xs">System</span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">{role.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{role.description || 'No description'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm, idx) => (
                    <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-medium ${getPermissionColor(perm)}`}>
                      {perm}
                    </span>
                  ))}
                </div>
                {!role.isSystemRole && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                    <button className="btn-ghost btn-sm">Edit</button>
                    <button className="btn-ghost btn-sm text-red-500 hover:text-red-700">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roles;
