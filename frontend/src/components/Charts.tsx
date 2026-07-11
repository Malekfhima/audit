import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, PieChart, Pie, Cell, Legend,
} from 'recharts';

// ==================== COLORS ====================
const COLORS = {
  primary: '#6366f1', success: '#10b981', warning: '#f59e0b',
  danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6',
};

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

// ==================== EMPTY STATE ====================
const EmptyChart: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center justify-center h-[280px] text-sm text-gray-400">{text}</div>
);

// ==================== CUSTOM TOOLTIP ====================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

// ==================== BAR CHART - Audits par statut ====================
export const AuditsBarChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
  if (!data?.length) return <EmptyChart text="No audit data available" />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
          {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// ==================== LINE CHART - Tendances ====================
export const TrendsLineChart: React.FC<{
  data: { month: string; audits: number; nc: number; actions: number }[];
}> = ({ data }) => {
  if (!data?.length) return <EmptyChart text="No trend data available" />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
        <Line type="monotone" dataKey="audits" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="nc" stroke={COLORS.danger} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="actions" stroke={COLORS.success} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// ==================== AREA CHART - Conformité ====================
export const ConformityAreaChart: React.FC<{
  data: { month: string; conformity: number }[];
}> = ({ data }) => {
  if (!data?.length) return <EmptyChart text="No conformity data available" />;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorConformity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="conformity" stroke={COLORS.success} strokeWidth={2} fill="url(#colorConformity)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ==================== PIE CHART - Distribution NC ====================
export const NCPieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  if (!data?.length) return <EmptyChart text="No NC data available" />;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
            paddingAngle={3} dataKey="value" animationDuration={1000}>
            {data.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {data.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
            <span className="text-xs text-gray-600">
              {entry.name}: <span className="font-semibold">{entry.value}</span>
              {total > 0 && <span className="text-gray-400"> ({Math.round((entry.value / total) * 100)}%)</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== RISK MATRIX HEATMAP ====================
export const RiskMatrixHeatmap: React.FC<{
  data: { probability: number; impact: number; count: number }[];
}> = ({ data }) => {
  const getCellColor = (p: number, i: number) => {
    const score = p * i;
    if (score >= 20) return '#ef4444';
    if (score >= 15) return '#f97316';
    if (score >= 8) return '#f59e0b';
    if (score >= 4) return '#eab308';
    return '#10b981';
  };

  const getCellCount = (p: number, i: number) =>
    data.find(d => d.probability === p && d.impact === i)?.count || 0;

  const levels = [5, 4, 3, 2, 1];

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-[280px]">
        <div className="flex items-end mb-2">
          <div className="w-16 flex-shrink-0" />
          <div className="flex-1 grid grid-cols-5 gap-1 text-center">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="text-[10px] text-gray-400 font-medium pb-1">{i}</div>
            ))}
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-16 flex-shrink-0 flex flex-col-reverse justify-around pr-2">
            {levels.map(l => (
              <div key={l} className="h-10 flex items-center justify-end text-[10px] text-gray-400 font-medium">{l}</div>
            ))}
          </div>
          <div className="flex-1 grid grid-rows-5 gap-1">
            {levels.map(p => (
              <div key={p} className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map(i => {
                  const count = getCellCount(p, i);
                  return (
                    <div key={i}
                      className="h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-transform hover:scale-105 cursor-default"
                      style={{ backgroundColor: getCellColor(p, i), opacity: count > 0 ? 1 : 0.4 }}
                      title={`P=${p}, I=${i}, Score=${p * i}, Risks: ${count}`}>
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-[10px] text-gray-400">Impact →</span>
        </div>
        <div className="flex justify-center mt-1">
          <span className="text-[10px] text-gray-400" style={{ writingMode: 'vertical-rl' }}>Probability ↓</span>
        </div>
      </div>
    </div>
  );
};

// ==================== GAUGE ====================
export const ConformityGauge: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const getColor = (v: number) => {
    if (v >= 80) return '#10b981';
    if (v >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const progress = Math.min(Math.max(value, 0), 100);
  const r = 80;
  const circumference = Math.PI * r;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="140" viewBox="0 0 200 140">
        <path d="M 20 120 A 80 80 0 0 1 180 120" fill="none" stroke="#f1f5f9" strokeWidth="16" strokeLinecap="round" />
        <path d="M 20 120 A 80 80 0 0 1 180 120" fill="none" stroke={getColor(progress)}
          strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${(progress / 100) * circumference} ${circumference}`}
          className="transition-all duration-1000 ease-out" />
        <text x="100" y="100" textAnchor="middle" className="text-3xl font-bold" fill={getColor(progress)}>
          {Math.round(progress)}%
        </text>
        <text x="100" y="125" textAnchor="middle" className="text-xs" fill="#94a3b8">{label}</text>
      </svg>
    </div>
  );
};

// ==================== CHART CARD ====================
export const ChartCard: React.FC<{
  title: string; subtitle?: string; icon?: React.ReactNode;
  children: React.ReactNode; className?: string;
}> = ({ title, subtitle, icon, children, className = '' }) => (
  <div className={`card ${className}`}>
    <div className="card-header">
      <div>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {icon}{title}
        </h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export { CHART_COLORS, COLORS };
