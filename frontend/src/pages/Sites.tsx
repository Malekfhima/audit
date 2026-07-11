import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, Building2, Globe, MapPin } from 'lucide-react';

interface Site {
  _id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  isActive: boolean;
  createdAt: string;
}

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/sites', { params });
      setSites(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch sites:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sites</h1>
          <p className="page-subtitle">Manage physical locations and facilities</p>
        </div>
        <button onClick={() => navigate('/sites/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Site
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search sites..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <button onClick={fetchSites} className="btn-primary">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : sites.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Building2 className="empty-state-icon" />
            <h3 className="empty-state-title">No sites found</h3>
            <p className="empty-state-text">Add your organization's sites and facilities.</p>
            <button onClick={() => navigate('/sites/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Add Site
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
                <th>Location</th>
                <th>Country</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site._id}>
                  <td className="font-semibold text-gray-900">{site.code}</td>
                  <td className="text-gray-900">{site.name}</td>
                  <td>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {site.city || '-'}
                    </span>
                  </td>
                  <td><span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400" />{site.country || '-'}</span></td>
                  <td>
                    <span className={site.isActive ? 'badge-success' : 'badge-neutral'}>
                      {site.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(site.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <button className="btn-ghost btn-sm">Edit</button>
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

export default Sites;
