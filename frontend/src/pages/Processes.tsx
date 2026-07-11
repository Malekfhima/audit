import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, Workflow, Users } from 'lucide-react';

interface Process {
  _id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  siteId: { name: string; _id: string };
  processOwnerId: { firstName: string; lastName: string; _id: string };
  isActive: boolean;
  createdAt: string;
}

const Processes: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/processes', { params });
      setProcesses(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch processes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Processes</h1>
          <p className="page-subtitle">Manage business processes and departments</p>
        </div>
        <button onClick={() => navigate('/processes/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Process
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search processes..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <button onClick={fetchProcesses} className="btn-primary">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : processes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Workflow className="empty-state-icon" />
            <h3 className="empty-state-title">No processes found</h3>
            <p className="empty-state-text">Define your organization's business processes.</p>
            <button onClick={() => navigate('/processes/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Add Process
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
                <th>Category</th>
                <th>Site</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process._id}>
                  <td className="font-semibold text-gray-900">{process.code}</td>
                  <td className="text-gray-900">{process.name}</td>
                  <td><span className="badge-neutral">{process.category}</span></td>
                  <td>{process.siteId?.name || '-'}</td>
                  <td><span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" />{process.processOwnerId ? `${process.processOwnerId.firstName} ${process.processOwnerId.lastName}` : '-'}</span></td>
                  <td><span className={process.isActive ? 'badge-success' : 'badge-neutral'}>{process.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>{new Date(process.createdAt).toLocaleDateString()}</td>
                  <td className="text-right"><button className="btn-ghost btn-sm">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Processes;
