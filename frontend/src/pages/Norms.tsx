import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Search, Scale, Eye, Edit3, X, Save, ChevronDown, ChevronRight } from 'lucide-react';

interface Clause {
  number: string;
  title: string;
  description: string;
  requirements: string[];
}

interface Norm {
  _id: string;
  name: string;
  code: string;
  description: string;
  version: string;
  status: string;
  category: string;
  clauses: Clause[];
  createdAt: string;
}

const emptyNorm = (): Partial<Norm> => ({
  name: '', code: '', description: '', version: '2015', status: 'ACTIVE', category: 'Qualité', clauses: [],
});

const Norms: React.FC = () => {
  const [norms, setNorms] = useState<Norm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'view' | 'edit' | 'add'; norm?: Norm } | null>(null);
  const [form, setForm] = useState<Partial<Norm>>({ ...emptyNorm() });
  const [saving, setSaving] = useState(false);
  const [expandedClause, setExpandedClause] = useState<string | null>(null);

  useEffect(() => { fetchNorms(); }, []);

  const fetchNorms = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/norms', { params });
      setNorms(response.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openView = (norm: Norm) => setModal({ type: 'view', norm });
  const openEdit = (norm: Norm) => { setForm({ ...norm }); setModal({ type: 'edit', norm }); };
  const openAdd = () => { setForm({ ...emptyNorm() }); setModal({ type: 'add' }); };

  const saveNorm = async () => {
    setSaving(true);
    try {
      if (modal?.type === 'edit' && modal.norm) {
        await api.put(`/norms/${modal.norm._id}`, form);
      } else {
        await api.post('/norms', form);
      }
      setModal(null);
      fetchNorms();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const addClause = () => {
    setForm(f => ({
      ...f,
      clauses: [...(f.clauses || []), { number: '', title: '', description: '', requirements: [] }],
    }));
  };

  const removeClause = (idx: number) => {
    setForm(f => ({ ...f, clauses: f.clauses?.filter((_, i) => i !== idx) }));
  };

  const updateClause = (idx: number, field: string, value: string | string[]) => {
    setForm(f => {
      const clauses = [...(f.clauses || [])];
      clauses[idx] = { ...clauses[idx], [field]: value };
      return { ...f, clauses };
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Normes</h1>
          <p className="page-subtitle">Gérer les normes et standards d&rsquo;audit (ISO, etc.)</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-5 h-5" /> Ajouter une norme
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher des normes..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-11" />
          </div>
          <button onClick={fetchNorms} className="btn-primary">Rechercher</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
      ) : norms.length === 0 ? (
        <div className="card"><div className="empty-state">
          <Scale className="empty-state-icon" />
          <h3 className="empty-state-title">Aucune norme trouvée</h3>
          <p className="empty-state-text">Ajoutez des normes ISO pour créer des check-lists d&rsquo;audit.</p>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter une norme</button>
        </div></div>
      ) : (
        <div className="table-container"><table className="table">
          <thead><tr><th>Code</th><th>Nom</th><th>Version</th><th>Catégorie</th><th>Clauses</th><th>Statut</th><th>Créé</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{norms.map((norm) => (
            <tr key={norm._id}>
              <td className="font-semibold text-gray-900">{norm.code}</td>
              <td className="text-gray-900">{norm.name}</td>
              <td>{norm.version || '-'}</td>
              <td><span className="badge-neutral">{norm.category || 'General'}</span></td>
              <td><span className="text-xs text-gray-500">{norm.clauses?.length || 0} clause(s)</span></td>
              <td><span className={norm.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}>{norm.status || 'DRAFT'}</span></td>
              <td>{new Date(norm.createdAt).toLocaleDateString()}</td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openView(norm)} className="btn-ghost btn-sm"><Eye className="w-4 h-4" /> Voir</button>
                  <button onClick={() => openEdit(norm)} className="btn-ghost btn-sm"><Edit3 className="w-4 h-4" /> Modifier</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {/* View Modal */}
      {modal?.type === 'view' && modal.norm && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="card-header">              <h2 className="text-lg font-semibold text-gray-900">{modal.norm.name}</h2>
              <button onClick={() => setModal(null)} className="btn-ghost btn-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="card-body space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Code</label><p className="font-semibold">{modal.norm.code}</p></div>
                <div><label className="label">Version</label><p>{modal.norm.version || '-'}</p></div>
                <div><label className="label">Catégorie</label><p>{modal.norm.category}</p></div>
                <div><label className="label">Statut</label><span className={modal.norm.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}>{modal.norm.status}</span></div>
              </div>
              <div><label className="label">Description</label><p className="text-sm text-gray-600">{modal.norm.description || 'Aucune description'}</p></div>
              <div>
                <label className="label">Clauses ({modal.norm.clauses?.length || 0})</label>
                <div className="space-y-2">
                  {modal.norm.clauses?.map((clause, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                      <button onClick={() => setExpandedClause(expandedClause === clause.number ? null : clause.number)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50">
                        <span className="font-medium text-gray-900">{clause.number} — {clause.title}</span>
                        {expandedClause === clause.number ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      </button>
                      {expandedClause === clause.number && (
                        <div className="px-4 pb-3 space-y-2 text-sm text-gray-600">
                          <p>{clause.description}</p>
                          {clause.requirements?.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 text-gray-500">
                              {clause.requirements.map((r, j) => <li key={j}>{r}</li>)}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {(modal?.type === 'edit' || modal?.type === 'add') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">{modal.type === 'add' ? 'Ajouter une norme' : 'Modifier la norme'}</h2>
              <button onClick={() => setModal(null)} className="btn-ghost btn-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Code *</label>
                  <input type="text" className="input" value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="ex. ISO9001" /></div>
                <div><label className="label">Nom *</label>
                  <input type="text" className="input" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom de la norme" /></div>
                <div><label className="label">Version</label>
                  <input type="text" className="input" value={form.version || ''} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} placeholder="e.g. 2015" /></div>
                <div><label className="label">Catégorie</label>
                  <select className="select" value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="Qualité">Qualité</option>
                    <option value="Environnement">Environnement</option>
                    <option value="Santé & Sécurité">Santé & Sécurité</option>
                    <option value="Sécurité de l'information">Sécurité de l'information</option>
                    <option value="Other">Autre</option>
                  </select></div>
                <div><label className="label">Statut</label>
                  <select className="select" value={form.status || ''} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="ACTIVE">Active</option><option value="DRAFT">Brouillon</option><option value="ARCHIVED">Archivée</option>
                  </select></div>
              </div>
              <div><label className="label">Description</label>
                <textarea className="textarea" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>

              {/* Clauses */}
              <div><label className="label">Clauses</label>
                {(form.clauses || []).map((clause, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Clause {idx + 1}</span>
                      <button onClick={() => removeClause(idx)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" className="input" placeholder="Numéro (ex. 4.4)" value={clause.number}
                        onChange={e => updateClause(idx, 'number', e.target.value)} />
                      <input type="text" className="input" placeholder="Titre" value={clause.title}
                        onChange={e => updateClause(idx, 'title', e.target.value)} />
                    </div>
                    <textarea className="textarea" placeholder="Description" value={clause.description}
                      onChange={e => updateClause(idx, 'description', e.target.value)} />
                  </div>
                ))}
                <button onClick={addClause} className="btn-secondary btn-sm"><Plus className="w-4 h-4" /> Ajouter une clause</button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
                <button onClick={saveNorm} disabled={saving || !form.code || !form.name} className="btn-primary">
                  {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4" /> Enregistrer</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Norms;
