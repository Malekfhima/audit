import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Shield, Edit3, X, Save, Trash2 } from 'lucide-react';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: string;
}

const PERMISSION_CATEGORIES: Record<string, string[]> = {
  'Users': ['users:read', 'users:write', 'roles:manage'],
  'Audits': ['audits:read', 'audits:write', 'audits:delete'],
  'Non-Conformities': ['nc:read', 'nc:write'],
  'Corrective Actions': ['actions:read', 'actions:write'],
  'Risks': ['risks:read', 'risks:write'],
  'Legal': ['legal:read', 'legal:write'],
  'Reports': ['reports:generate'],
  'Settings': ['settings:manage'],
};

const emptyRole = (): Partial<Role> => ({ name: '', description: '', permissions: [] });

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ type: 'edit' | 'add'; role?: Role } | null>(null);
  const [form, setForm] = useState<Partial<Role>>({ ...emptyRole() });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    try { const response = await api.get('/roles'); setRoles(response.data.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openEdit = (role: Role) => { setForm({ ...role }); setModal({ type: 'edit', role }); };
  const openAdd = () => { setForm({ ...emptyRole() }); setModal({ type: 'add' }); };

  const saveRole = async () => {
    setSaving(true);
    try {
      if (modal?.type === 'edit' && modal.role) { await api.put(`/roles/${modal.role._id}`, form); }
      else { await api.post('/roles', form); }
      setModal(null); fetchRoles();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const deleteRole = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete "${role.name}"?`)) return;
    try { await api.delete(`/roles/${role._id}`); fetchRoles(); } catch (err) { console.error(err); }
  };

  const togglePermission = (perm: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions?.includes(perm)
        ? f.permissions.filter(p => p !== perm)
        : [...(f.permissions || []), perm],
    }));
  };

  const getPermissionColor = (perm: string) => {
    const colors: Record<string, string> = { 'read': 'bg-blue-100 text-blue-700', 'write': 'bg-emerald-100 text-emerald-700',
      'delete': 'bg-red-100 text-red-700', 'manage': 'bg-purple-100 text-purple-700', 'generate': 'bg-amber-100 text-amber-700' };
    const key = Object.keys(colors).find(k => perm.toLowerCase().includes(k));
    return key ? colors[key] : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Rôles et permissions</h1><p className="page-subtitle">Définir les rôles et les permissions d&rsquo;accès</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un rôle</button>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 w-full" />)}</div>
      ) : roles.length === 0 ? (
        <div className="card"><div className="empty-state">
          <Shield className="empty-state-icon" /><h3 className="empty-state-title">Aucun rôle trouvé</h3>
          <p className="empty-state-text">Créez des rôles pour gérer les permissions des utilisateurs.</p>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-5 h-5" /> Ajouter un rôle</button>
        </div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role._id} className="card hover:shadow-lg transition-all duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  {role.isSystemRole && <span className="badge-info text-xs">Système</span>}
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">{role.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{role.description || 'Aucune description'}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {role.permissions.slice(0, 6).map((perm, idx) => (
                    <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-medium ${getPermissionColor(perm)}`}>{perm}</span>
                  ))}
                  {role.permissions.length > 6 && <span className="text-xs text-gray-400">+{role.permissions.length - 6} autres</span>}
                </div>
                {!role.isSystemRole && (
                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                    <button onClick={() => openEdit(role)} className="btn-ghost btn-sm"><Edit3 className="w-4 h-4" /> Modifier</button>
                    <button onClick={() => deleteRole(role)} className="btn-ghost btn-sm text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /> Supprimer</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal?.type === 'edit' || modal?.type === 'add') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="text-lg font-semibold">{modal.type === 'add' ? 'Ajouter un rôle' : 'Modifier le rôle'}</h2>
              <button onClick={() => setModal(null)} className="btn-ghost btn-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Nom du rôle *</label>
                  <input type="text" className="input" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ex. SUPERVISEUR" /></div>
                <div className="col-span-2"><label className="label">Description</label>
                  <textarea className="textarea" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Décrivez les responsabilités de ce rôle" /></div>
              </div>

              <div><label className="label">Permissions</label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{category}</p>
                      <div className="flex flex-wrap gap-2">
                        {perms.map(perm => (
                          <label key={perm}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                              form.permissions?.includes(perm)
                                ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                                : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100'
                            }`}>
                            <input type="checkbox" checked={form.permissions?.includes(perm) || false}
                              onChange={() => togglePermission(perm)} className="sr-only" />
                            {perm.split(':')[1]}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setModal(null)} className="btn-secondary">Annuler</button>
                <button onClick={saveRole} disabled={saving || !form.name} className="btn-primary">
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

export default Roles;
