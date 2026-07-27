import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Save } from 'lucide-react';

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
      setError('Veuillez remplir tous les champs obligatoires');
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
    } catch (err: any) { setError(err.response?.data?.message || 'Échec de la création de l\'exigence');
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/legal')} className="btn-ghost mb-6"><ArrowLeft className="w-4 h-4" /> Retour</button>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ajouter une exigence légale</h1>
          <p className="page-subtitle">Enregistrer une nouvelle exigence légale ou réglementaire</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Titre *</label>
                <input type="text" className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                  placeholder="Titre de l'exigence" required />
              </div>
              <div>
                <label className="label">Référence *</label>
                <input type="text" className="input" value={form.reference} onChange={e => setForm(p => ({...p, reference: e.target.value}))}
                  placeholder="ex. ISO 14001:2015 §7.5" required />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Décrivez l'exigence..." rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Catégorie</label>
                <select className="input" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                  <option value="QUALITY">Qualité</option>
                  <option value="ENVIRONMENT">Environnement</option>
                  <option value="HEALTH_AND_SAFETY">Santé & Sécurité</option>
                  <option value="LABOR">Travail</option>
                  <option value="DATA_PROTECTION">Protection des données</option>
                  <option value="INDUSTRY_SPECIFIC">Secteur spécifique</option>
                </select>
              </div>
              <div>
                <label className="label">Responsable *</label>
                <select className="input" value={form.responsibleId} onChange={e => setForm(p => ({...p, responsibleId: e.target.value}))} required>
                  <option value="">Sélectionner un utilisateur...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Jurisdiction</label>
                <input type="text" className="input" value={form.jurisdiction} onChange={e => setForm(p => ({...p, jurisdiction: e.target.value}))}
                  placeholder="ex. Union européenne" />
              </div>
              <div>
                <label className="label">Authority</label>
                <input type="text" className="input" value={form.authority} onChange={e => setForm(p => ({...p, authority: e.target.value}))}
                  placeholder="ex. Commission européenne" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Date d'effet *</label>
                <input type="date" className="input" value={form.effectiveDate} onChange={e => setForm(p => ({...p, effectiveDate: e.target.value}))} required />
              </div>
              <div>
                <label className="label">Date de révision *</label>
                <input type="date" className="input" value={form.reviewDate} onChange={e => setForm(p => ({...p, reviewDate: e.target.value}))} required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/legal')} className="btn-secondary">Annuler</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Création...</> : <><Save className="w-4 h-5" /> Ajouter l'exigence</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewLegalRequirement;
