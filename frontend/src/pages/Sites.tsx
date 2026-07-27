import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Search, Building2, Globe, MapPin, Edit3, X, Save, Phone, Mail } from 'lucide-react';

interface Site {
  _id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  siteManagerId?: { _id: string; firstName: string; lastName: string } | string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string;
}

interface AppUser { _id: string; firstName: string; lastName: string; email: string; role: string; }

const emptySite = (): Partial<Site> => ({
  name: '', code: '', address: '', city: '', country: 'Tunisie', postalCode: '',
  contactEmail: '', contactPhone: '', isActive: true,
});

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'edit' | 'add'; site?: Site } | null>(null);
  const [form, setForm] = useState<Partial<Site>>({ ...emptySite() });
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => { fetchSites(); fetchUsers(); }, []);

  const fetchSites = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/sites', { params });
      setSites(response.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try { const r = await api.get('/users'); setUsers(r.data.data || []); } catch (e) {}
  };

  const openEdit = (site: Site) => { setForm({ ...site }); setModal({ type: 'edit', site }); };
  const openAdd = () => { setForm({ ...emptySite() }); setModal({ type: 'add' }); };

  const saveSite = async () => {
    setSaving(true);
    try {
      if (modal?.type === 'edit' && modal.site) {
        await api.put(`/sites/${modal.site._id}`, form);
      } else { await api.post('/sites', form); }
      setModal(null); fetchSites();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const toggleActive = async (site: Site) => {
    try {
      if (site.isActive) { await api.post(`/sites/${site._id}/deactivate`); }
      else { await api.post(`/sites/${site._id}/activate`); }
      fetchSites();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Sites</h1><p className="page-subtitle">Gérer les sites et installations</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un site</button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher des sites..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <button onClick={fetchSites} className="btn-primary">Rechercher</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
      ) : sites.length === 0 ? (
        <div className="card"><div className="empty-state">
          <Building2 className="empty-state-icon" /><h3 className="empty-state-title">Aucun site trouvé</h3>
          <p className="empty-state-text">Ajoutez les sites et installations de votre organisation.</p>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un site</button>
        </div></div>
      ) : (
        <div className="table-container"><table className="table">
          <thead><tr><th>Code</th><th>Nom</th><th>Localisation</th><th>Pays</th><th>Responsable</th><th>Statut</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{sites.map((site) => (
            <tr key={site._id}>
              <td className="font-semibold text-gray-900">{site.code}</td>
              <td className="text-gray-900">{site.name}</td>
              <td><span className="flex items-center gap-1.5 text-gray-500"><MapPin className="w-3.5 h-3.5" />{site.city || '-'}</span></td>
              <td><span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400" />{site.country || '-'}</span></td>
              <td className="text-sm">{typeof site.siteManagerId === 'object' ? `${site.siteManagerId.firstName} ${site.siteManagerId.lastName}` : '-'}</td>
              <td><span className={site.isActive ? 'badge-success' : 'badge-neutral'}>{site.isActive ? 'Actif' : 'Inactif'}</span></td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(site)} className="btn-ghost btn-sm"><Edit3 className="w-4 h-4" /> Modifier</button>
                  <button onClick={() => toggleActive(site)} className={`btn-ghost btn-sm ${site.isActive ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {site.isActive ? 'Désactiver' : 'Activer'}
                  </button>
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
              <h2 className="text-lg font-semibold">{modal.type === 'add' ? 'Ajouter un site' : 'Modifier le site'}</h2>
              <button onClick={() => setModal(null)} className="btn-ghost btn-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Code *</label>
                  <input type="text" className="input" value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="ex. TUN-01" /></div>
                <div><label className="label">Nom *</label>
                  <input type="text" className="input" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom du site" /></div>
                <div className="col-span-2"><label className="label">Adresse</label>
                  <input type="text" className="input" value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Adresse complète" /></div>
                <div><label className="label">Ville</label>
                  <input type="text" className="input" value={form.city || ''} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Ville" /></div>
                <div><label className="label">Code postal</label>
                  <input type="text" className="input" value={form.postalCode || ''} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} /></div>
                <div><label className="label">Pays</label>
                  <input type="text" className="input" value={form.country || ''} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
                <div><label className="label">Responsable du site</label>
                  <select className="select" value={typeof form.siteManagerId === 'object' ? form.siteManagerId._id : form.siteManagerId || ''}
                    onChange={e => setForm(f => ({ ...f, siteManagerId: e.target.value }))}>
                    <option value="">Sélectionner un responsable</option>
                    {users.filter(u => ['ADMIN','MANAGER'].includes(u.role)).map(u => (
                      <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                    ))}
                  </select></div>
                <div><label className="label">Email de contact</label>
                  <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="email" className="input pl-11" value={form.contactEmail || ''} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} /></div></div>
                <div><label className="label">Téléphone</label>
                  <div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" className="input pl-11" value={form.contactPhone || ''} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} /></div></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
                <button onClick={saveSite} disabled={saving || !form.code || !form.name} className="btn-primary">
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

export default Sites;
