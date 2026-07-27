import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
  FileText, AlertTriangle, CheckCircle, AlertTriangle as RiskIcon,
  TrendingUp, Clock, Calendar, ArrowRight, Activity,
} from 'lucide-react';
import {
  AuditsBarChart, TrendsLineChart, ConformityAreaChart,
  NCPieChart, RiskMatrixHeatmap, ConformityGauge,
  ChartCard,
} from '../components/Charts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Échec de récupération des statistiques du tableau de bord :', error);
    } finally {
      setLoading(false);
    }
  };

  // Données mockées pour les graphiques (en attendant les endpoints temps réel)
  const auditChartData = [
    { name: 'Planifiés', value: stats?.audits?.planned || 3, color: '#3b82f6' },
    { name: 'En cours', value: stats?.audits?.inProgress || 2, color: '#f59e0b' },
    { name: 'Terminés', value: stats?.audits?.completed || 5, color: '#10b981' },
  ];

  const trendData = [
    { month: 'Janv', audits: 2, nc: 4, actions: 3 },
    { month: 'Fév', audits: 3, nc: 6, actions: 5 },
    { month: 'Mar', audits: 5, nc: 3, actions: 4 },
    { month: 'Avr', audits: 4, nc: 5, actions: 6 },
    { month: 'Mai', audits: 6, nc: 2, actions: 3 },
    { month: 'Juin', audits: 3, nc: 4, actions: 7 },
  ];

  const conformityData = [
    { month: 'Janv', conformity: 72 },
    { month: 'Fév', conformity: 68 },
    { month: 'Mar', conformity: 75 },
    { month: 'Avr', conformity: 82 },
    { month: 'Mai', conformity: 78 },
    { month: 'Juin', conformity: 85 },
  ];

  const ncPieData = [
    { name: 'Critique', value: stats?.nc?.critical || 1 },
    { name: 'Majeure', value: stats?.nc?.major || 3 },
    { name: 'Mineure', value: stats?.nc?.minor || 5 },
    { name: 'Faible', value: stats?.nc?.low || 2 },
  ];

  const riskMatrixData = [
    { probability: 5, impact: 5, count: 1 },
    { probability: 4, impact: 4, count: 2 },
    { probability: 4, impact: 3, count: 1 },
    { probability: 3, impact: 4, count: 2 },
    { probability: 2, impact: 3, count: 3 },
    { probability: 1, impact: 2, count: 2 },
  ];

  const statCards = [
    {
      label: 'Total audits',
      value: stats?.audits?.total ?? 0,
      icon: FileText, gradient: 'from-blue-500 to-blue-600',
      path: '/audits',
      details: [
        { label: 'Planifiés', value: stats?.audits?.planned ?? 0, color: 'text-blue-600' },
        { label: 'En cours', value: stats?.audits?.inProgress ?? 0, color: 'text-amber-600' },
        { label: 'Terminés', value: stats?.audits?.completed ?? 0, color: 'text-emerald-600' },
      ],
    },
    {
      label: 'Non-conformités',
      value: stats?.nc?.total ?? 0,
      icon: AlertTriangle, gradient: 'from-red-500 to-red-600',
      path: '/non-conformities',
      details: [
        { label: 'Ouvertes', value: stats?.nc?.open ?? 0, color: 'text-red-600' },
        { label: 'Critiques', value: stats?.nc?.critical ?? 0, color: 'text-red-700' },
        { label: 'Fermées', value: stats?.nc?.closed ?? 0, color: 'text-emerald-600' },
      ],
    },
    {
      label: 'Actions correctives',
      value: stats?.actions?.total ?? 0,
      icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600',
      path: '/corrective-actions',
      details: [
        { label: 'En attente', value: stats?.actions?.pending ?? 0, color: 'text-amber-600' },
        { label: 'En cours', value: stats?.actions?.inProgress ?? 0, color: 'text-blue-600' },
        { label: 'En retard', value: stats?.actions?.overdue ?? 0, color: 'text-red-600' },
      ],
    },
    {
      label: 'Risques',
      value: stats?.risks?.total ?? 0,
      icon: RiskIcon, gradient: 'from-purple-500 to-purple-600',
      path: '/risks',
      details: [
        { label: 'Élevés', value: stats?.risks?.high ?? 0, color: 'text-red-600' },
        { label: 'Moyens', value: stats?.risks?.medium ?? 0, color: 'text-amber-600' },
        { label: 'Faibles', value: stats?.risks?.low ?? 0, color: 'text-emerald-600' },
      ],
    },
  ];

  const quickActions = [
    { label: 'Nouvel audit', icon: FileText, path: '/audits/new', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Signaler NC', icon: AlertTriangle, path: '/non-conformities/new', color: 'from-red-500 to-red-600' },
    { label: 'Ajouter risque', icon: RiskIcon, path: '/risks/new', color: 'from-purple-500 to-purple-600' },
    { label: 'Générer rapport', icon: TrendingUp, path: '/reports/new', color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <p className="page-subtitle">Aperçu en temps réel de votre système de gestion d&rsquo;audit</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6"><div className="skeleton h-4 w-24 mb-4" /><div className="skeleton h-10 w-20 mb-4" /><div className="space-y-2"><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-3/4" /></div></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6"><div className="skeleton h-6 w-48 mb-6" /><div className="skeleton h-[280px] w-full" /></div>
            <div className="card p-6"><div className="skeleton h-6 w-48 mb-6" /><div className="skeleton h-[280px] w-full" /></div>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="stats-grid">
            {statCards.map((card) => (
              <div key={card.label} className="card cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => navigate(card.path)}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-serif text-3xl font-semibold text-gray-900">{card.value}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">{card.label}</h3>
                  <div className="space-y-1.5">
                    {card.details.map((detail: any) => (
                      <div key={detail.label} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{detail.label}</span>
                        <span className={`font-semibold ${detail.color}`}>{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 - Audit & Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Audits par statut" subtitle="Répartition actuelle" icon={<FileText className="w-4 h-4 text-blue-500" />}>
              <AuditsBarChart data={auditChartData} />
            </ChartCard>
            <ChartCard title="Tendances mensuelles" subtitle="Audits, NC & Actions" icon={<TrendingUp className="w-4 h-4 text-indigo-500" />}>
              <TrendsLineChart data={trendData} />
            </ChartCard>
          </div>

          {/* Charts Row 2 - Conformité & NC Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Tendance de conformité" subtitle="Sur les 6 derniers mois" icon={<Activity className="w-4 h-4 text-emerald-500" />}>
              <ConformityAreaChart data={conformityData} />
            </ChartCard>
            <ChartCard title="Répartition des NC" subtitle="Par niveau de gravité" icon={<AlertTriangle className="w-4 h-4 text-red-500" />}>
              <NCPieChart data={ncPieData} />
            </ChartCard>
          </div>

          {/* Charts Row 3 - Risk Matrix & Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="Matrice des risques" subtitle="Probabilité × Impact" icon={<RiskIcon className="w-4 h-4 text-purple-500" />}
              className="lg:col-span-2">
              <RiskMatrixHeatmap data={riskMatrixData} />
            </ChartCard>
            <div className="space-y-6">
              <ChartCard title="Conformité globale" subtitle="Score général" icon={<Activity className="w-4 h-4 text-emerald-500" />}>
                <ConformityGauge value={stats?.audits?.completed > 0 ? 78 : 0} label="Taux de conformité" />
              </ChartCard>
              <div className="card">
                <div className="card-body text-center space-y-2">
                  <p className="text-sm font-medium text-gray-700">Actions rapides</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button key={action.label} onClick={() => navigate(action.path)}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 text-xs font-medium text-gray-600 hover:text-gray-900">
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Activité récente</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {[
                  { icon: CheckCircle, bg: 'bg-emerald-100', color: 'text-emerald-600', title: 'Audit #AUD-2024-0001 terminé', time: 'il y a 2 heures' },
                  { icon: FileText, bg: 'bg-blue-100', color: 'text-blue-600', title: 'Nouvel audit créé : ISO 9001 Qualité', time: 'il y a 5 heures' },
                  { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-600', title: 'Non-conformité NC-2024-0015 signalée', time: 'il y a 1 jour' },
                  { icon: CheckCircle, bg: 'bg-purple-100', color: 'text-purple-600', title: 'Action corrective CA-2024-008 terminée', time: 'il y a 2 jours' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors">
                    <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
