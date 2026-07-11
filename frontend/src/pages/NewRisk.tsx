import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Save } from 'lucide-react';

const NewRisk: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', category: 'OPERATIONAL',
    probability: 3, impact: 3, ownerId: '', identifiedById: '',
    mitigationPlan: '', contingencyPlan: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.ownerId || !form.identifiedById) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/risks', form);
      navigate('/risks');
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create risk');
    } finally { setLoading(false); }
  };

  const riskScore = form.probability * form.impact;
  const getScoreColor = (s: number) => s >= 20 ? 'text-red-600' : s >= 15 ? 'text-orange-600' : s >= 8 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/risks')} className="btn-ghost mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Risk</h1>
          <p className="page-subtitle">Identify a new risk</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Title *</label>
              <input type="text" className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                placeholder="e.g., Supply chain disruption risk" required />
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Describe the risk..." rows={3} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                  <option value="OPERATIONAL">Operational</option>
                  <option value="FINANCIAL">Financial</option>
                  <option value="COMPLIANCE">Compliance</option>
                  <option value="STRATEGIC">Strategic</option>
                  <option value="REPUTATIONAL">Reputational</option>
                  <option value="TECHNOLOGY">Technology</option>
                </select>
              </div>
              <div>
                <label className="label">Owner *</label>
                <select className="input" value={form.ownerId} onChange={e => setForm(p => ({...p, ownerId: e.target.value}))} required>
                  <option value="">Select owner...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Probability (1-5)</label>
                <input type="range" min={1} max={5} value={form.probability}
                  onChange={e => setForm(p => ({...p, probability: parseInt(e.target.value)}))}
                  className="w-full accent-indigo-600" />
                <span className="text-sm text-gray-500">{form.probability}/5</span>
              </div>
              <div>
                <label className="label">Impact (1-5)</label>
                <input type="range" min={1} max={5} value={form.impact}
                  onChange={e => setForm(p => ({...p, impact: parseInt(e.target.value)}))}
                  className="w-full accent-indigo-600" />
                <span className="text-sm text-gray-500">{form.impact}/5</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Risk Score (P × I)</p>
              <p className={`font-serif text-3xl font-semibold ${getScoreColor(riskScore)}`}>{riskScore}</p>
            </div>
            <div>
              <label className="label">Identified By *</label>
              <select className="input" value={form.identifiedById} onChange={e => setForm(p => ({...p, identifiedById: e.target.value}))} required>
                <option value="">Select user...</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Mitigation Plan</label>
              <textarea className="textarea" value={form.mitigationPlan} onChange={e => setForm(p => ({...p, mitigationPlan: e.target.value}))}
                placeholder="How will this risk be mitigated?" rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/risks')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-warning">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><Save className="w-4 h-5" /> Add Risk</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRisk;
