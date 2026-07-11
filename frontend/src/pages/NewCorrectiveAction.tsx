import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

const NewCorrectiveAction: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ncs, setNcs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    nonConformityId: '', description: '', actionType: 'CORRECTIVE',
    responsibleId: '', dueDate: '', resources: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/non-conformities').then(r => setNcs(r.data.data || [])).catch(() => {}),
      api.get('/users').then(r => setUsers(r.data.data || [])).catch(() => {}),
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nonConformityId || !form.description || !form.responsibleId || !form.dueDate) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/corrective-actions', {
        ...form,
        dueDate: new Date(form.dueDate),
        createdById: user?.id || '',
      });
      navigate('/corrective-actions');
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create action');
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/corrective-actions')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="page-header">
        <div>
          <h1 className="page-title">New Corrective Action</h1>
          <p className="page-subtitle">Plan an action to address a non-conformity</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Non-Conformity *</label>
              <select className="input" value={form.nonConformityId} onChange={e => setForm(p => ({...p, nonConformityId: e.target.value}))} required>
                <option value="">Select NC...</option>
                {ncs.map(nc => <option key={nc._id} value={nc._id}>{nc.ncNumber} - {nc.title || nc.description?.substring(0, 50)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Describe the action plan..." rows={4} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Action Type *</label>
                <select className="input" value={form.actionType} onChange={e => setForm(p => ({...p, actionType: e.target.value}))}>
                  <option value="CORRECTIVE">Corrective</option>
                  <option value="PREVENTIVE">Preventive</option>
                  <option value="IMPROVEMENT">Improvement</option>
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
                <label className="label">Due Date *</label>
                <input type="date" className="input" value={form.dueDate}
                  onChange={e => setForm(p => ({...p, dueDate: e.target.value}))} required />
              </div>
              <div>
                <label className="label">Resources</label>
                <input type="text" className="input" value={form.resources}
                  onChange={e => setForm(p => ({...p, resources: e.target.value}))} placeholder="Required resources..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/corrective-actions')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-success">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><Save className="w-4 h-5" /> Create Action</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCorrectiveAction;
