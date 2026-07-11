import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, AlertTriangle, Filter } from 'lucide-react';

interface NC {
  _id: string;
  ncNumber: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  auditId: { title: string; auditNumber: string; _id: string };
  assignedToId: { firstName: string; lastName: string; _id: string };
  createdAt: string;
}

const NonConformities: React.FC = () => {
  const [ncs, setNcs] = useState<NC[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNCs();
  }, []);

  const fetchNCs = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (severityFilter) params.severity = severityFilter;
      const response = await api.get('/non-conformities', { params });
      setNcs(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch NCs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const map: Record<string, string> = {
      CRITICAL: 'badge-danger',
      HIGH: 'badge-danger',
      MEDIUM: 'badge-warning',
      LOW: 'badge-info',
      MAJOR: 'badge-danger',
      MINOR: 'badge-info',
    };
    return <span className={map[severity] || 'badge-neutral'}>{severity}</span>;
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      OPEN: 'badge-danger',
      IN_PROGRESS: 'badge-warning',
      RESOLVED: 'badge-info',
      CLOSED: 'badge-success',
      CANCELLED: 'badge-neutral',
    };
    return <span className={map[status] || 'badge-neutral'}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Non-Conformities</h1>
          <p className="page-subtitle">Track and manage audit findings</p>
        </div>
        <button onClick={() => navigate('/non-conformities/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Report NC
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search non-conformities..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input min-w-[140px]">
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="input min-w-[130px]">
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="MAJOR">Major</option>
            <option value="MINOR">Minor</option>
            <option value="LOW">Low</option>
          </select>
          <button onClick={fetchNCs} className="btn-primary">
            <Filter className="w-4 h-4" /> Apply
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : ncs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <AlertTriangle className="empty-state-icon" />
            <h3 className="empty-state-title">No non-conformities found</h3>
            <p className="empty-state-text">All audits are clear! Non-conformities will appear here when reported.</p>
            <button onClick={() => navigate('/non-conformities/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Report NC
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Audit</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ncs.map((nc) => (
                <tr key={nc._id} className="cursor-pointer" onClick={() => navigate(`/non-conformities/${nc._id}`)}>
                  <td className="font-semibold text-gray-900">{nc.ncNumber}</td>
                  <td className="text-gray-900 max-w-[250px] truncate">{nc.title || nc.description}</td>
                  <td>{getSeverityBadge(nc.severity)}</td>
                  <td>{getStatusBadge(nc.status)}</td>
                  <td className="text-gray-500">{nc.auditId?.auditNumber || '-'}</td>
                  <td>{nc.assignedToId ? `${nc.assignedToId.firstName} ${nc.assignedToId.lastName}` : 'Unassigned'}</td>
                  <td>{new Date(nc.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <button className="btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/non-conformities/${nc._id}`); }}>View</button>
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

export default NonConformities;
