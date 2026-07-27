import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Search, Users as UsersIcon, Mail, Edit3, X, Save } from 'lucide-react';

interface AppUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const emptyUser = (): Partial<AppUser> => ({
  firstName: '', lastName: '', email: '', role: 'AUDITOR', isActive: true,
});

const Users: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'edit' | 'add'; user?: AppUser } | null>(null);
  const [form, setForm] = useState<Partial<AppUser>>({ ...emptyUser() });
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await api.get('/users', { params });
      setUsers(response.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openEdit = (user: AppUser) => { setForm({ ...user }); setPassword(''); setModal({ type: 'edit', user }); };
  const openAdd = () => { setForm({ ...emptyUser() }); setPassword(''); setModal({ type: 'add' }); };

  const saveUser = async () => {
    if (modal?.type === 'add' && (!password || password.length < 8)) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setSaving(true);
    try {
      if (modal?.type === 'edit' && modal.user) {
        const data: any = { ...form };
        if (password) data.password = password;
        await api.put(`/users/${modal.user._id}`, data);
      } else {
        await api.post('/users', { ...form, password });
      }
      setModal(null); fetchUsers();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const toggleActive = async (user: AppUser) => {
    try {
      if (user.isActive) { await api.post(`/users/${user._id}/deactivate`); }
      else { await api.post(`/users/${user._id}/activate`); }
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, string> = { ADMIN: 'badge-danger', MANAGER: 'badge-warning', AUDITOR: 'badge-info', USER: 'badge-neutral' };
    return <span className={map[role] || 'badge-neutral'}>{role}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Utilisateurs</h1><p className="page-subtitle">Gérer les utilisateurs et leurs rôles</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un utilisateur</button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher des utilisateurs..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <button onClick={fetchUsers} className="btn-primary">Rechercher</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
      ) : users.length === 0 ? (
        <div className="card"><div className="empty-state">
          <UsersIcon className="empty-state-icon" /><h3 className="empty-state-title">Aucun utilisateur trouvé</h3>
          <p className="empty-state-text">Ajoutez des membres de l'équipe au système.</p>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un utilisateur</button>
        </div></div>
      ) : (
        <div className="table-container"><table className="table">
          <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Créé</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{users.map((user) => (
            <tr key={user._id} className={!user.isActive ? 'opacity-60' : ''}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div><p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p></div>
                </div>
              </td>
              <td><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{user.email}</span></td>
              <td>{getRoleBadge(user.role)}</td>
              <td><span className={user.isActive ? 'badge-success' : 'badge-danger'}>{user.isActive ? 'Actif' : 'Inactif'}</span></td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(user)} className="btn-ghost btn-sm"><Edit3 className="w-4 h-4" /> Modifier</button>
                  <button onClick={() => toggleActive(user)} className={`btn-ghost btn-sm ${user.isActive ? 'text-amber-500 hover:text-amber-700' : 'text-emerald-500 hover:text-emerald-700'}`}>
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {(modal?.type === 'edit' || modal?.type === 'add') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="text-lg font-semibold">{modal.type === 'add' ? 'Ajouter un utilisateur' : `Modifier l'utilisateur`}</h2>
              <button onClick={() => setModal(null)} className="btn-ghost btn-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Prénom *</label>
                  <input type="text" className="input" value={form.firstName || ''} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
                <div><label className="label">Nom *</label>
                  <input type="text" className="input" value={form.lastName || ''} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
                <div className="col-span-2"><label className="label">Email *</label>
                  <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="email" className="input pl-11" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div></div>
                <div><label className="label">Rôle</label>
                  <select className="select" value={form.role || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="ADMIN">Admin</option><option value="MANAGER">Manager</option>
                    <option value="AUDITOR">Auditeur</option><option value="USER">Utilisateur</option>
                  </select></div>
                <div><label className="label">{modal.type === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe (optionnel)'}</label>
                  <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder={modal.type === 'add' ? 'Min. 8 caractères' : 'Laisser vide pour conserver'} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
                <button onClick={saveUser} disabled={saving || !form.firstName || !form.lastName || !form.email} className="btn-primary">
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

export default Users;
