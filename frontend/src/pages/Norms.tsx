import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, Scale, BookOpen } from 'lucide-react';

interface Norm {
  _id: string;
  name: string;
  code: string;
  description: string;
  version: string;
  status: string;
  category: string;
  createdAt: string;
}

const Norms: React.FC = () => {
  const [norms, setNorms] = useState<Norm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNorms();
  }, []);

  const fetchNorms = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/norms', { params });
      setNorms(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch norms:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Norms</h1>
          <p className="page-subtitle">Manage audit norms and standards (ISO, etc.)</p>
        </div>
        <button onClick={() => navigate('/norms/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Norm
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search norms..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-11" />
          </div>
          <button onClick={fetchNorms} className="btn-primary">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : norms.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Scale className="empty-state-icon" />
            <h3 className="empty-state-title">No norms found</h3>
            <p className="empty-state-text">Add ISO standards and other norms to create audit checklists.</p>
            <button onClick={() => navigate('/norms/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Add Norm
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Version</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {norms.map((norm) => (
                <tr key={norm._id}>
                  <td className="font-semibold text-gray-900">{norm.code}</td>
                  <td className="text-gray-900">{norm.name}</td>
                  <td>{norm.version || '-'}</td>
                  <td><span className="badge-neutral">{norm.category || 'General'}</span></td>
                  <td>
                    <span className={norm.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}>
                      {norm.status || 'DRAFT'}
                    </span>
                  </td>
                  <td>{new Date(norm.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <button className="btn-ghost btn-sm">View</button>
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

export default Norms;
