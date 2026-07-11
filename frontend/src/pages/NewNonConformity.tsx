import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

const NewNonConformity: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [audits, setAudits] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    auditId: '', description: '', rootCause: '', severity: 'MAJOR',
    detectedById: '', assignedToId: '', targetClosureDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/audits').then(r => setAudits(r.data.data || [])).catch(() => {}),
      api.get('/users').then(r => setUsers(r.data.data || [])).catch(() => {}),
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.auditId || !form.description || !form.detectedById) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/non-conformities', {
        ...form,
        targetClosureDate: form.targetClosureDate ? new Date(form.targetClosureDate) : undefined,
      });
      navigate('/non-conformities');
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create non-conformity');
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/non-conformities')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="page-header">
        <div>
          <h1 className="page-title">Report Non-Conformity</h1>
          <p className="page-subtitle">Document an audit finding</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Audit *</label>
              <select className="input" value={form.auditId} onChange={e => setForm(p => ({...p, auditId: e.target.value}))} required>
                <option value="">Select audit...</option>
                {audits.map(a => <option key={a._id} value={a._id}>{a.auditNumber} - {a.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Describe the non-conformity..." rows={4} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Severity *</label>
                <select className="input" value={form.severity} onChange={e => setForm(p => ({...p, severity: e.target.value}))}>
                  <option value="CRITICAL">Critical</option>
                  <option value="MAJOR">Major</option>
                  <option value="MINOR">Minor</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="label">Detected By *</label>
                <select className="input" value={form.detectedById} onChange={e => setForm(p => ({...p, detectedById: e.target.value}))} required>
                  <option value="">Select user...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Root Cause</label>
                <textarea className="textarea" value={form.rootCause} onChange={e => setForm(p => ({...p, rootCause: e.target.value}))}
                  placeholder="Root cause analysis..." rows={3} />
              </div>
              <div>
                <label className="label">Assigned To</label>
                <select className="input" value={form.assignedToId} onChange={e => setForm(p => ({...p, assignedToId: e.target.value}))}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Target Closure Date</label>
              <input type="date" className="input" value={form.targetClosureDate}
                onChange={e => setForm(p => ({...p, targetClosureDate: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/non-conformities')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><Save className="w-4 h-5" /> Report NC</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewNonConformity;
