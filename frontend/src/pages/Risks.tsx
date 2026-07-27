import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, AlertTriangle, Filter, TrendingUp } from 'lucide-react';

interface Risk {
  _id: string;
  riskNumber: string;
  title: string;
  description: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  riskLevel: string;
  status: string;
  ownerId: { firstName: string; lastName: string; _id: string };
  createdAt: string;
}

const Risks: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchRisks(); }, []);

  const fetchRisks = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (levelFilter) params.riskLevel = levelFilter;
      const response = await api.get('/risks', { params });
      setRisks(response.data.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const getLevelBadge = (level: string) => {
    const map: Record<string, string> = {
      CRITICAL: 'badge-danger', HIGH: 'badge-warning',
      MEDIUM: 'badge-info', LOW: 'badge-success',
    };
    return <span className={map[level] || 'badge-neutral'}>{level}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-red-600';
    if (score >= 15) return 'text-orange-600';
    if (score >= 8) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Risques</h1>
          <p className="page-subtitle">Identifier, évaluer et atténuer les risques</p>
        </div>
        <button onClick={() => navigate('/risks/new')} className="btn-warning">
          <Plus className="w-5 h-5" /> Ajouter un risque
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher des risques..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
          </div>
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="input min-w-[140px]">
            <option value="">Tous les niveaux</option>
            <option value="CRITICAL">Critique</option>
            <option value="HIGH">Élevé</option>
            <option value="MEDIUM">Moyen</option>
            <option value="LOW">Faible</option>
          </select>
          <button onClick={fetchRisks} className="btn-primary"><Filter className="w-4 h-4" /> Appliquer</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : risks.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <AlertTriangle className="empty-state-icon" />
            <h3 className="empty-state-title">Aucun risque trouvé</h3>
            <p className="empty-state-text">Commencez à identifier les risques pour votre organisation.</p>
            <button onClick={() => navigate('/risks/new')} className="btn-warning">
              <Plus className="w-5 h-5" /> Ajouter un risque
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Critiques', count: risks.filter(r => r.riskLevel === 'CRITICAL').length, color: 'bg-red-500' },
              { label: 'Élevés', count: risks.filter(r => r.riskLevel === 'HIGH').length, color: 'bg-orange-500' },
              { label: 'Moyens', count: risks.filter(r => r.riskLevel === 'MEDIUM').length, color: 'bg-amber-500' },
              { label: 'Faibles', count: risks.filter(r => r.riskLevel === 'LOW').length, color: 'bg-emerald-500' },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 text-center">
                <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="font-serif text-2xl font-semibold text-gray-900">{stat.count}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>P</th>
                  <th>I</th>
                  <th>Score</th>
                  <th>Niveau</th>
                  <th>Propriétaire</th>
                  <th>Statut</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((risk) => (
                  <tr key={risk._id} className="cursor-pointer" onClick={() => navigate(`/risks/${risk._id}`)}>
                    <td className="font-semibold text-gray-900">{risk.riskNumber}</td>
                    <td className="text-gray-900 max-w-[200px] truncate">{risk.title}</td>
                    <td><span className="badge-neutral">{risk.category}</span></td>
                    <td>{risk.probability}</td>
                    <td>{risk.impact}</td>
                    <td className={`font-bold ${getScoreColor(risk.riskScore)}`}>{risk.riskScore}</td>
                    <td>{getLevelBadge(risk.riskLevel)}</td>
                    <td>{risk.ownerId ? `${risk.ownerId.firstName} ${risk.ownerId.lastName}` : '-'}</td>
                    <td><span className="badge-neutral">{risk.status}</span></td>
                    <td className="text-right"><button className="btn-ghost btn-sm">Voir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Risks;
