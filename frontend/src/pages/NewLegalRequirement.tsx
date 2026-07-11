import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Save, Scale } from 'lucide-react';

const NewLegalRequirement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '', reference: '', description: '', category: 'QUALITY',
    jurisdiction: '', authority: '', effectiveDate: '', reviewDate: '',
    responsibleId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.reference || !form.effectiveDate || !form.reviewDate || !form.responsibleId) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/legal/requirements', {
        ...form,
        effectiveDate: new Date(form.effectiveDate),
        reviewDate: new Date(form.reviewDate),
      });
      navigate('/legal');
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create requirement');
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/legal')} className="btn-ghost mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Legal Requirement</h1>
          <p className="page-subtitle">Register a new legal or regulatory requirement</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Title *</label>
                <input type="text" className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                  placeholder="Requirement title" required />
              </div>
              <div>
                <label className="label">Reference *</label>
                <input type="text" className="input" value={form.reference} onChange={e => setForm(p => ({...p, reference: e.target.value}))}
                  placeholder="e.g., ISO 14001:2015 §7.5" required />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Describe the requirement..." rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                  <option value="QUALITY">Quality</option>
                  <option value="ENVIRONMENT">Environment</option>
                  <option value="HEALTH_AND_SAFETY">Health & Safety</option>
                  <option value="LABOR">Labor</option>
                  <option value="DATA_PROTECTION">Data Protection</option>
                  <option value="INDUSTRY_SPECIFIC">Industry Specific</option>
                </select>
              </div>
              <div>
                <label className="label">Responsible *</label>
                <select className="input" value={form.responsibleId} onChange={e => setForm(p => ({...p, responsibleId: e.target.value}))} required>
                  <option value="">Select user...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Jurisdiction</label>
                <input type="text" className="input" value={form.jurisdiction} onChange={e => setForm(p => ({...p, jurisdiction: e.target.value}))}
                  placeholder="e.g., European Union" />
              </div>
              <div>
                <label className="label">Authority</label>
                <input type="text" className="input" value={form.authority} onChange={e => setForm(p => ({...p, authority: e.target.value}))}
                  placeholder="e.g., European Commission" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Effective Date *</label>
                <input type="date" className="input" value={form.effectiveDate} onChange={e => setForm(p => ({...p, effectiveDate: e.target.value}))} required />
              </div>
              <div>
                <label className="label">Review Date *</label>
                <input type="date" className="input" value={form.reviewDate} onChange={e => setForm(p => ({...p, reviewDate: e.target.value}))} required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/legal')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><Save className="w-4 h-5" /> Add Requirement</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewLegalRequirement;
