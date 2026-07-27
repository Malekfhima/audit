import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, FileText, Download, Clock, FileSpreadsheet } from 'lucide-react';

interface Report {
  _id: string;
  reportNumber: string;
  name: string;
  type: string;
  format: string;
  status: string;
  filePath?: string;
  generatedAt: string;
  createdAt: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const params: any = {};
      if (typeFilter) params.type = typeFilter;
      const response = await api.get('/reports', { params });
      setReports(response.data.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      COMPLETED: 'badge-success', GENERATING: 'badge-warning', FAILED: 'badge-danger',
    };
    return <span className={map[status] || 'badge-neutral'}>{status}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rapports</h1>
          <p className="page-subtitle">Générer et télécharger des rapports d&rsquo;audit</p>
        </div>
        <button onClick={() => navigate('/reports/new')} className="btn-primary">
          <Plus className="w-5 h-5" /> Générer un rapport
        </button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex gap-4">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input min-w-[200px]">
            <option value="">Tous les types</option>
            <option value="AUDIT_SUMMARY">Résumé d'audit</option>
            <option value="NC_REPORT">Rapport NC</option>
            <option value="ACTION_TRACKING">Suivi d'actions</option>
            <option value="RISK_REGISTER">Registre des risques</option>
            <option value="COMPLIANCE_REPORT">Rapport de conformité</option>
          </select>
          <button onClick={fetchReports} className="btn-primary">Filtrer</button>
        </div>
      </div>

      {loading ? (
        <div className="card p-6 space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText className="empty-state-icon" />
            <h3 className="empty-state-title">Aucun rapport trouvé</h3>
            <p className="empty-state-text">Générez des rapports d'audit à télécharger et partager.</p>
            <button onClick={() => navigate('/reports/new')} className="btn-primary">
              <Plus className="w-5 h-5" /> Générer un rapport
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Rapport #</th>
                <th>Nom</th>
                <th>Type</th>
                <th>Format</th>
                <th>Statut</th>
                <th>Généré</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="font-semibold text-gray-900">{report.reportNumber}</td>
                  <td className="text-gray-900">{report.name}</td>
                  <td><span className="badge-neutral">{report.type.replace('_', ' ')}</span></td>
                  <td><span className="flex items-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5 text-gray-400" />{report.format}</span></td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" />{new Date(report.generatedAt).toLocaleDateString()}</span></td>
                  <td className="text-right">
                    {report.status === 'COMPLETED' ? (
                      <button className="btn-success btn-sm">
                        <Download className="w-4 h-4" /> Télécharger
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 rounded-lg border border-gray-100">
                        <Clock className="w-3.5 h-3.5" /> {report.status === 'GENERATING' ? 'Génération...' : 'Échec'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
