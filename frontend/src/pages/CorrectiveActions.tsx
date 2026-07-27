import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, CheckCircle, Filter, Calendar } from 'lucide-react';

interface Action {
  _id: string;
  actionNumber: string;
  title: string;
  description: string;
  status: string;
  actionType: string;
  nonConformityId: { ncNumber: string; _id: string };
  responsibleId: { firstName: string; lastName: string; _id: string };
  dueDate: string;
  createdAt: string;
}

const CorrectiveActions: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchActions(); }, []);

  const fetchActions = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const response = await api.get('/corrective-actions', { params });
      setActions(response.data.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: 'badge-info', IN_PROGRESS: 'badge-warning',
      COMPLETED: 'badge-success', VERIFIED: 'badge-success',
      CANCELLED: 'badge-neutral', OPEN: 'badge-danger',
    };
    return <span className={map[status] || 'badge-neutral'}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Actions correctives</h1>
          <p className="page-subtitle">Suivre et gérer les actions correctives et préventives</p>
        </div>
        <button onClick={() => navigate('/corrective-actions/new')} className="btn-success">
          <Plus className="w-5 h-5" /> Nouvelle action
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher des actions..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input min-w-[140px]">
            <option value="">Tous les statuts</option>
            <option value="PLANNED">Planifiée</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminée</option>
            <option value="VERIFIED">Vérifiée</option>
          </select>
          <button onClick={fetchActions} className="btn-primary"><Filter className="w-4 h-4" /> Appliquer</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : actions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <CheckCircle className="empty-state-icon" />
            <h3 className="empty-state-title">Aucune action trouvée</h3>
            <p className="empty-state-text">Créez des actions correctives pour traiter les non-conformités.</p>
            <button onClick={() => navigate('/corrective-actions/new')} className="btn-success">
              <Plus className="w-5 h-5" /> Nouvelle action
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Description</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Réf. NC</th>
                <th>Responsable</th>
                <th>Échéance</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action._id} className="cursor-pointer" onClick={() => navigate(`/corrective-actions/${action._id}`)}>
                  <td className="font-semibold text-gray-900">{action.actionNumber}</td>
                  <td className="text-gray-900 max-w-[250px] truncate">{action.title || action.description}</td>
                  <td><span className="badge-neutral">{action.actionType}</span></td>
                  <td>{getStatusBadge(action.status)}</td>
                  <td className="text-gray-500">{action.nonConformityId?.ncNumber || '-'}</td>
                  <td>{action.responsibleId ? `${action.responsibleId.firstName} ${action.responsibleId.lastName}` : 'Non assigné'}</td>
                  <td><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" />{action.dueDate ? new Date(action.dueDate).toLocaleDateString() : '-'}</span></td>
                  <td className="text-right"><button className="btn-ghost btn-sm">Voir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CorrectiveActions;
