import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Download } from 'lucide-react';

const NewReport: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'AUDIT_SUMMARY', format: 'PDF',
    filters: '{}',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      setError('Veuillez saisir un nom de rapport');
      return;
    }
    setLoading(true);
    try {
      let filters = {};
      try { filters = JSON.parse(form.filters); } catch { filters = {}; }
      await api.post('/reports', { ...form, filters });
      navigate('/reports');
    } catch (err: any) { setError(err.response?.data?.message || 'Échec de la génération du rapport');
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate('/reports')} className="btn-ghost mb-6"><ArrowLeft className="w-4 h-4" /> Retour</button>
      <div className="page-header">
        <div>
          <h1 className="page-title">Générer un rapport</h1>
          <p className="page-subtitle">Créer un nouveau rapport</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Nom du rapport *</label>
              <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                placeholder="ex. Résumé d'audit T1 2024" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Type de rapport</label>
                <select className="input" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                  <option value="AUDIT_SUMMARY">Résumé d'audit</option>
                  <option value="NC_REPORT">Rapport NC</option>
                  <option value="ACTION_TRACKING">Suivi d'actions</option>
                  <option value="RISK_REGISTER">Registre des risques</option>
                  <option value="COMPLIANCE_REPORT">Rapport de conformité</option>
                  <option value="SITE_PERFORMANCE">Performance du site</option>
                </select>
              </div>
              <div>
                <label className="label">Format</label>
                <select className="input" value={form.format} onChange={e => setForm(p => ({...p, format: e.target.value}))}>
                  <option value="PDF">PDF</option>
                  <option value="EXCEL">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Filters (JSON)</label>
              <textarea className="textarea font-mono text-xs" value={form.filters}
                onChange={e => setForm(p => ({...p, filters: e.target.value}))}
                placeholder='{"siteId": "...", "startDate": "2024-01-01", "endDate": "2024-12-31"}'
                rows={4} />
              <p className="text-xs text-gray-400 mt-1">Optionnel : filtrer le contenu du rapport en JSON</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/reports')} className="btn-secondary">Annuler</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Génération...</> : <><Download className="w-4 h-5" /> Générer le rapport</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReport;
