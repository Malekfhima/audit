import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Save } from 'lucide-react';

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
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    try {
      await api.post('/non-conformities', {
        ...form,
        targetClosureDate: form.targetClosureDate ? new Date(form.targetClosureDate) : undefined,
      });
      navigate('/non-conformities');
    } catch (err: any) { setError(err.response?.data?.message || 'Échec de la création de la non-conformité');
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/non-conformities')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
      <div className="page-header">
        <div>
          <h1 className="page-title">Signaler une non-conformité</h1>
          <p className="page-subtitle">Documenter un constat d&rsquo;audit</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Audit *</label>
              <select className="input" value={form.auditId} onChange={e => setForm(p => ({...p, auditId: e.target.value}))} required>
                <option value="">Sélectionner un audit...</option>
                {audits.map(a => <option key={a._id} value={a._id}>{a.auditNumber} - {a.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Décrivez la non-conformité..." rows={4} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Gravité *</label>
                <select className="input" value={form.severity} onChange={e => setForm(p => ({...p, severity: e.target.value}))}>
                  <option value="CRITICAL">Critique</option>
                  <option value="MAJOR">Majeure</option>
                  <option value="MINOR">Mineure</option>
                  <option value="LOW">Faible</option>
                </select>
              </div>
              <div>
                <label className="label">Détecté par *</label>
                <select className="input" value={form.detectedById} onChange={e => setForm(p => ({...p, detectedById: e.target.value}))} required>
                  <option value="">Sélectionner un utilisateur...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Cause racine</label>
                <textarea className="textarea" value={form.rootCause} onChange={e => setForm(p => ({...p, rootCause: e.target.value}))}
                  placeholder="Analyse des causes racines..." rows={3} />
              </div>
              <div>
                <label className="label">Assigné à</label>
                <select className="input" value={form.assignedToId} onChange={e => setForm(p => ({...p, assignedToId: e.target.value}))}>
                  <option value="">Non assigné</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Date de clôture cible</label>
              <input type="date" className="input" value={form.targetClosureDate}
                onChange={e => setForm(p => ({...p, targetClosureDate: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/non-conformities')} className="btn-secondary">Annuler</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Création...</> : <><Save className="w-4 h-5" /> Signaler la NC</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewNonConformity;
