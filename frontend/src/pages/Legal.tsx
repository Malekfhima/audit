import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, Scale, BookOpen, Globe, Calendar } from 'lucide-react';

interface LegalReq {
  _id: string;
  requirementNumber: string;
  title: string;
  reference: string;
  description: string;
  category: string;
  jurisdiction: string;
  authority: string;
  effectiveDate: string;
  reviewDate: string;
  status: string;
  createdAt: string;
}

const Legal: React.FC = () => {
  const [requirements, setRequirements] = useState<LegalReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchRequirements(); }, []);

  const fetchRequirements = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/legal/requirements', { params });
      setRequirements(response.data.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Legal Compliance</h1>
          <p className="page-subtitle">Track legal and regulatory requirements</p>
        </div>
        <button onClick={() => navigate('/legal/requirements/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Requirement
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search legal requirements..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <button onClick={fetchRequirements} className="btn-primary">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : requirements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Scale className="empty-state-icon" />
            <h3 className="empty-state-title">No legal requirements found</h3>
            <p className="empty-state-text">Track applicable laws and regulations for your sites.</p>
            <button onClick={() => navigate('/legal/requirements/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Add Requirement
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Title</th>
                <th>Category</th>
                <th>Jurisdiction</th>
                <th>Authority</th>
                <th>Effective</th>
                <th>Review</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req._id}>
                  <td className="font-semibold text-gray-900">{req.requirementNumber}</td>
                  <td className="text-gray-900 max-w-[250px] truncate">{req.title}</td>
                  <td><span className="badge-neutral">{req.category}</span></td>
                  <td><span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400" />{req.jurisdiction}</span></td>
                  <td className="text-gray-500">{req.authority}</td>
                  <td>{req.effectiveDate ? new Date(req.effectiveDate).toLocaleDateString() : '-'}</td>
                  <td>{req.reviewDate ? new Date(req.reviewDate).toLocaleDateString() : '-'}</td>
                  <td className="text-right"><button className="btn-ghost btn-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Legal;
