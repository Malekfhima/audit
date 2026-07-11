import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, Filter, Eye, Play, CheckCircle, XCircle, Clock, Calendar, Building2, FileText } from 'lucide-react';

interface Audit {
  _id: string;
  title: string;
  auditNumber: string;
  type: string;
  status: string;
  siteId: { name: string; _id: string };
  normId: { name: string; _id: string };
  leadAuditorId: { firstName: string; lastName: string; _id: string };
  plannedStartDate: string;
  plannedEndDate: string;
  conformityScore: number;
  createdAt: string;
}

const Audits: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      const response = await api.get('/audits', { params });
      setAudits(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; icon: React.ReactNode }> = {
      PLANNED: { class: 'badge-info', icon: <Clock className="w-3 h-3" /> },
      IN_PROGRESS: { class: 'badge-warning', icon: <Play className="w-3 h-3" /> },
      COMPLETED: { class: 'badge-success', icon: <CheckCircle className="w-3 h-3" /> },
      CANCELLED: { class: 'badge-danger', icon: <XCircle className="w-3 h-3" /> },
    };
    const item = map[status] || { class: 'badge-neutral', icon: null };
    return (
      <span className={`${item.class} capitalize`}>
        {item.icon}
        {status.replace('_', ' ').toLowerCase()}
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Audits</h1>
          <p className="page-subtitle">Manage and monitor all audit activities</p>
        </div>
        <button onClick={() => navigate('/audits/new')} className="btn-primary">
          <Plus className="w-5 h-5" />
          New Audit
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text" placeholder="Search audits..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-11" />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-10 pr-8 min-w-[140px] appearance-none cursor-pointer">
                <option value="">All Statuses</option>
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="input min-w-[130px]">
              <option value="">All Types</option>
              <option value="INTERNAL">Internal</option>
              <option value="EXTERNAL">External</option>
              <option value="CERTIFICATION">Certification</option>
            </select>
            <button onClick={fetchAudits} className="btn-primary">
              <Filter className="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-5 w-48" />
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-5 w-20" />
            </div>
          ))}
        </div>
      ) : audits.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText className="empty-state-icon" />
            <h3 className="empty-state-title">No audits found</h3>
            <p className="empty-state-text">Get started by creating your first audit plan.</p>
            <button onClick={() => navigate('/audits/new')} className="btn-primary">
              <Plus className="w-5 h-5" />
              Create First Audit
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
                <th>Type</th>
                <th>Status</th>
                <th>Site</th>
                <th>Norm</th>
                <th>Auditor</th>
                <th>Start Date</th>
                <th>Score</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit) => (
                <tr key={audit._id} className="hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => navigate(`/audits/${audit._id}`)}>
                  <td className="font-medium text-gray-900">{audit.auditNumber}</td>
                  <td className="text-gray-900">{audit.title}</td>
                  <td><span className="badge-neutral capitalize">{audit.type?.toLowerCase()}</span></td>
                  <td>{getStatusBadge(audit.status)}</td>
                  <td>{audit.siteId?.name || '-'}</td>
                  <td>{audit.normId?.name || '-'}</td>
                  <td>{audit.leadAuditorId ? `${audit.leadAuditorId.firstName} ${audit.leadAuditorId.lastName}` : '-'}</td>
                  <td>{audit.plannedStartDate ? new Date(audit.plannedStartDate).toLocaleDateString() : '-'}</td>
                  <td>
                    {audit.conformityScore ? (
                      <span className={`font-semibold ${audit.conformityScore >= 80 ? 'text-emerald-600' : audit.conformityScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {audit.conformityScore}%
                      </span>
                    ) : '-'}
                  </td>
                  <td className="text-right">
                    <button className="btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/audits/${audit._id}`); }}>
                      <Eye className="w-4 h-4" />
                    </button>
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

export default Audits;
