import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Save } from 'lucide-react';

const NewAudit: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [norms, setNorms] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '', type: 'INTERNAL', normId: '', siteId: '',
    leadAuditorId: '', plannedStartDate: '', plannedEndDate: '', scope: '', objectives: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/norms').then(r => setNorms(r.data.data || [])).catch(() => {}),
      api.get('/sites').then(r => setSites(r.data.data || [])).catch(() => {}),
      api.get('/users').then(r => setUsers(r.data.data || [])).catch(() => {}),
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.normId || !form.siteId || !form.leadAuditorId || !form.plannedStartDate || !form.plannedEndDate) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/audits', {
        ...form,
        plannedStartDate: new Date(form.plannedStartDate),
        plannedEndDate: new Date(form.plannedEndDate),
      });
      navigate('/audits');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create audit');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/audits')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Audits
      </button>
      <div className="page-header">
        <div>
          <h1 className="page-title">New Audit</h1>
          <p className="page-subtitle">Create a new audit plan</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Title *</label>
              <input type="text" className="input" value={form.title} onChange={e => updateField('title', e.target.value)}
                placeholder="e.g., ISO 9001 Quality Audit Q1 2024" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Type *</label>
                <select className="input" value={form.type} onChange={e => updateField('type', e.target.value)}>
                  <option value="INTERNAL">Internal</option>
                  <option value="EXTERNAL">External</option>
                  <option value="CERTIFICATION">Certification</option>
                  <option value="SURVEILLANCE">Surveillance</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                </select>
              </div>
              <div>
                <label className="label">Norm *</label>
                <select className="input" value={form.normId} onChange={e => updateField('normId', e.target.value)} required>
                  <option value="">Select norm...</option>
                  {norms.map(n => <option key={n._id} value={n._id}>{n.code} - {n.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Site *</label>
                <select className="input" value={form.siteId} onChange={e => updateField('siteId', e.target.value)} required>
                  <option value="">Select site...</option>
                  {sites.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div>
                <label className="label">Lead Auditor *</label>
                <select className="input" value={form.leadAuditorId} onChange={e => updateField('leadAuditorId', e.target.value)} required>
                  <option value="">Select auditor...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date *</label>
                <input type="date" className="input" value={form.plannedStartDate} onChange={e => updateField('plannedStartDate', e.target.value)} required />
              </div>
              <div>
                <label className="label">End Date *</label>
                <input type="date" className="input" value={form.plannedEndDate} onChange={e => updateField('plannedEndDate', e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label">Scope</label>
              <textarea className="textarea" value={form.scope} onChange={e => updateField('scope', e.target.value)}
                placeholder="Define the audit scope..." rows={3} />
            </div>
            <div>
              <label className="label">Objectives</label>
              <textarea className="textarea" value={form.objectives} onChange={e => updateField('objectives', e.target.value)}
                placeholder="Define audit objectives..." rows={3} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/audits')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><Save className="w-4 h-5" /> Create Audit</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAudit;
