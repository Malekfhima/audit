import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Search, Workflow, Users, Edit3, X, Save, Building2 } from 'lucide-react';

interface SiteInfo { _id: string; name: string; }
interface UserInfo { _id: string; firstName: string; lastName: string; }

const getSiteName = (s: SiteInfo | string | undefined) => typeof s === 'object' ? s?.name : '-';
const getSiteId = (s: SiteInfo | string | undefined) => typeof s === 'object' ? s?._id : s;
const getUserName = (u: UserInfo | string | undefined) => typeof u === 'object' ? `${u?.firstName} ${u?.lastName}` : '-';
const getUserId = (u: UserInfo | string | undefined) => typeof u === 'object' ? u?._id : u;

interface Process {
  _id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  siteId: SiteInfo | string;
  processOwnerId: UserInfo | string;
  isActive: boolean;
  createdAt: string;
}

const emptyProcess = (): Partial<Process> => ({
  name: '', code: '', description: '', category: 'PRODUCTION', isActive: true,
});

const Processes: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'edit' | 'add'; process?: Process } | null>(null);
  const [form, setForm] = useState<Partial<Process>>({ ...emptyProcess() });
  const [saving, setSaving] = useState(false);
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => { fetchProcesses(); fetchSites(); fetchUsers(); }, []);

  const fetchProcesses = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/processes', { params });
      setProcesses(response.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const fetchSites = async () => { try { const r = await api.get('/sites'); setSites(r.data.data || []); } catch (e) {} };
  const fetchUsers = async () => { try { const r = await api.get('/users'); setUsers(r.data.data || []); } catch (e) {} };

  const openEdit = (p: Process) => { setForm({ ...p, siteId: getSiteId(p.siteId), processOwnerId: getUserId(p.processOwnerId) }); setModal({ type: 'edit', process: p }); };
  const openAdd = () => { setForm({ ...emptyProcess() }); setModal({ type: 'add' }); };

  const saveProcess = async () => {
    setSaving(true);
    try {
      if (modal?.type === 'edit' && modal.process) {
        await api.put(`/processes/${modal.process._id}`, form);
      } else { await api.post('/processes', form); }
      setModal(null); fetchProcesses();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const toggleActive = async (p: Process) => {
    try {
      if (p.isActive) { await api.post(`/processes/${p._id}/deactivate`); }
      else { await api.post(`/processes/${p._id}/activate`); }
      fetchProcesses();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Processus</h1><p className="page-subtitle">Gérer les processus métier et départements</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un processus</button>
      </div>
      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher des processus..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <button onClick={fetchProcesses} className="btn-primary">Rechercher</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
      ) : processes.length === 0 ? (
        <div className="card"><div className="empty-state">
          <Workflow className="empty-state-icon" /><h3 className="empty-state-title">Aucun processus trouvé</h3>
          <p className="empty-state-text">Définissez les processus métier de votre organisation.</p>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un processus</button>
        </div></div>
      ) : (
        <div className="table-container"><table className="table">
          <thead><tr><th>Code</th><th>Nom</th><th>Catégorie</th><th>Site</th><th>Propriétaire</th><th>Statut</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{processes.map((p) => (
            <tr key={p._id}>
              <td className="font-semibold text-gray-900">{p.code}</td>
              <td className="text-gray-900">{p.name}</td>
              <td><span className="badge-neutral">{p.category}</span></td>
              <td><span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-gray-400" />{getSiteName(p.siteId)}</span></td>
              <td><span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" />{getUserName(p.processOwnerId)}</span></td>
              <td><span className={p.isActive ? 'badge-success' : 'badge-neutral'}>{p.isActive ? 'Actif' : 'Inactif'}</span></td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(p)} className="btn-ghost btn-sm"><Edit3 className="w-4 h-4" /> Modifier</button>
                  <button onClick={() => toggleActive(p)} className={`btn-ghost btn-sm ${p.isActive ? 'text-amber-500' : 'text-emerald-500'}`}>{p.isActive ? 'Désactiver' : 'Activer'}</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {(modal?.type === 'edit' || modal?.type === 'add') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="text-lg font-semibold">{modal.type === 'add' ? 'Ajouter un processus' : 'Modifier le processus'}</h2>
              <button onClick={() => setModal(null)} className="btn-ghost btn-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Code *</label>
                  <input type="text" className="input" value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="ex. PRC-PROD-01" /></div>
                <div><label className="label">Nom *</label>
                  <input type="text" className="input" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom du processus" /></div>
                <div><label className="label">Catégorie</label>
                  <select className="select" value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="PRODUCTION">Production</option><option value="QUALITY">Qualité</option>
                    <option value="MAINTENANCE">Maintenance</option><option value="LOGISTICS">Logistique</option>
                    <option value="ADMINISTRATION">Administration</option><option value="OTHER">Autre</option>
                  </select></div>
                <div><label className="label">Site</label>
                  <select className="select" value={getSiteId(form.siteId) || ''} onChange={e => setForm(f => ({ ...f, siteId: e.target.value }))}>
                    <option value="">Sélectionner un site</option>
                    {sites.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select></div>
                <div><label className="label">Propriétaire du processus</label>
                  <select className="select" value={getUserId(form.processOwnerId) || ''} onChange={e => setForm(f => ({ ...f, processOwnerId: e.target.value }))}>
                    <option value="">Sélectionner un propriétaire</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                  </select></div>
              </div>
              <div><label className="label">Description</label>
                <textarea className="textarea" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
                <button onClick={saveProcess} disabled={saving || !form.code || !form.name} className="btn-primary">
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

export default Processes;
