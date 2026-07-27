import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, Play, CheckCircle, XCircle, FileText, AlertTriangle, CheckCircle as CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

const AuditDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreMessage, setScoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (id) fetchAudit();
  }, [id]);

  const fetchAudit = async () => {
    try {
      const response = await api.get(`/audits/${id}`);
      setAudit(response.data.data);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const handleAction = async (action: string) => {
    try {
      await api.post(`/audits/${id}/${action}`);
      await fetchAudit();
    } catch (err) { console.error(err); }
  };

  const handleCalculateScore = async () => {
    setScoreLoading(true);
    setScoreMessage(null);
    try {
      const response = await api.post(`/audits/${id}/calculate-score`);
      const newScore = response.data.data?.conformityScore;
      await fetchAudit();
      setScoreMessage({
        type: 'success',
        text: newScore !== undefined ? `Score calculé : ${newScore}%` : 'Score calculé avec succès !',
      });
    } catch (err: any) {
      console.error(err);
      setScoreMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to calculate score' });
    } finally {
      setScoreLoading(false);
      setTimeout(() => setScoreMessage(null), 5000);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;
  if (!audit) return <div className="text-center py-12">Audit introuvable</div>;

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: 'badge-info', IN_PROGRESS: 'badge-warning',
      COMPLETED: 'badge-success', CANCELLED: 'badge-danger',
    };
    const labels: Record<string, string> = { PLANNED: 'Planifié', IN_PROGRESS: 'En cours', COMPLETED: 'Terminé', CANCELLED: 'Annulé' };
    return <span className={map[status] || 'badge-neutral'}>{labels[status] || status.replace('_', ' ')}</span>;
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/audits')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour aux audits
      </button>

      {/* Header */}
      <div className="card mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-2xl font-semibold text-gray-900">{audit.title}</h1>
                {getStatusBadge(audit.status)}
              </div>
              <p className="text-sm text-gray-500">
                {audit.auditNumber} &middot; {audit.type?.replace('_', ' ')}
              </p>
            </div>
            <div className="flex gap-2">
              {audit.status === 'PLANNED' && (
                <button onClick={() => handleAction('start')} className="btn-success">
                  <Play className="w-4 h-4" /> Démarrer l'audit
                </button>
              )}
              {audit.status === 'IN_PROGRESS' && (
                <button onClick={() => handleAction('complete')} className="btn-success">
                  <CheckCircle className="w-4 h-4" /> Terminer l'audit
                </button>
              )}
              {(audit.status === 'PLANNED' || audit.status === 'IN_PROGRESS') && (
                <button onClick={() => handleAction('cancel')} className="btn-danger">
                  <XCircle className="w-4 h-4" /> Annuler
                </button>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Norme</p>
              <p className="text-sm font-medium text-gray-900">{audit.normId?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Site</p>
              <p className="text-sm font-medium text-gray-900">{audit.siteId?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Auditeur principal</p>
              <p className="text-sm font-medium text-gray-900">
                {audit.leadAuditorId ? `${audit.leadAuditorId.firstName} ${audit.leadAuditorId.lastName}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Score de conformité</p>
              <p className={`text-sm font-bold ${audit.conformityScore >= 80 ? 'text-emerald-600' : audit.conformityScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {audit.conformityScore !== undefined && audit.conformityScore !== null && !isNaN(audit.conformityScore) ? `${audit.conformityScore}%` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Début prévu</p>
              <p className="text-sm text-gray-700">{audit.plannedStartDate ? new Date(audit.plannedStartDate).toLocaleDateString() : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Fin prévue</p>
              <p className="text-sm text-gray-700">{audit.plannedEndDate ? new Date(audit.plannedEndDate).toLocaleDateString() : '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="border-b border-gray-100">
          <div className="flex">
            {['summary', 'checklist', 'non-conformities', 'actions', 'report'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}>
                {{
                  summary: 'Résumé',
                  checklist: 'Check-list',
                  'non-conformities': 'Non-conformités',
                  actions: 'Actions',
                  report: 'Rapport'
                }[tab] || tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {audit.scope && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Périmètre</h3>
                  <p className="text-sm text-gray-600">{audit.scope}</p>
                </div>
              )}
              {audit.objectives && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Objectifs</h3>
                  <p className="text-sm text-gray-600">{audit.objectives}</p>
                </div>
              )}
              {audit.summary && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Résumé</h3>
                  <p className="text-sm text-gray-600">{audit.summary}</p>
                </div>
              )}
              {!audit.scope && !audit.objectives && !audit.summary && (
                <p className="text-sm text-gray-400 text-center py-8">Aucun résumé disponible pour le moment.</p>
              )}
            </div>
          )}
          {activeTab === 'checklist' && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">La gestion de la check-list sera disponible dans l'implémentation complète.</p>
            </div>
          )}
          {activeTab === 'non-conformities' && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Les non-conformités de cet audit apparaîtront ici.</p>
            </div>
          )}
          {activeTab === 'actions' && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Les actions correctives de cet audit apparaîtront ici.</p>
            </div>
          )}
          {activeTab === 'report' && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">Générer un rapport PDF pour cet audit.</p>
              {scoreMessage && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                  scoreMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {scoreMessage.text}
                </div>
              )}
              <button
                onClick={handleCalculateScore}
                disabled={scoreLoading}
                className="btn-primary min-w-[180px] justify-center">
                {scoreLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Calcul...</>
                ) : (
                  <><RefreshCw className="w-4 h-4" /> Calculer le score</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditDetail;
