import { Star, Users, Euro, BarChart3, Eye, MessageSquare, CheckCircle, Heart, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import DarkTooltip from './DarkTooltip';
import type { Pro } from './types';

interface Props {
  pros: Pro[];
  favorites: string[];
}

const StatsTab = ({ pros, favorites }: Props) => {
  const totalPros   = pros.length;
  const djCount     = pros.filter(p => p.role === 'dj').length;
  const staffCount  = pros.filter(p => p.role === 'staff').length;
  const makeupCount = pros.filter(p => p.role === 'makeup').length;
  const avgRate     = totalPros > 0 ? Math.round(pros.reduce((s, p) => s + (p.hourly_rate || 0), 0) / totalPros) : 0;
  const verifiedCount = pros.filter(p => p.is_verified).length;

  const pieData = [
    { name: 'DJ',     value: djCount,     color: '#D4AF37' },
    { name: 'Staff',  value: staffCount,  color: '#8B5CF6' },
    { name: 'Makeup', value: makeupCount, color: '#EC4899' },
  ];

  const djAvgRate     = pros.filter(p => p.role === 'dj').reduce((s, p) => s + (p.hourly_rate || 0), 0) / (djCount || 1);
  const staffAvgRate  = pros.filter(p => p.role === 'staff').reduce((s, p) => s + (p.hourly_rate || 0), 0) / (staffCount || 1);
  const makeupAvgRate = pros.filter(p => p.role === 'makeup').reduce((s, p) => s + (p.hourly_rate || 0), 0) / (makeupCount || 1);
  const rateBarData = [
    { name: 'DJ',     '€/hora avg': djCount     > 0 ? Math.round(djAvgRate)     : 0, color: '#D4AF37' },
    { name: 'Staff',  '€/hora avg': staffCount  > 0 ? Math.round(staffAvgRate)  : 0, color: '#8B5CF6' },
    { name: 'Makeup', '€/hora avg': makeupCount > 0 ? Math.round(makeupAvgRate) : 0, color: '#EC4899' },
  ];

  const weeklyData = [
    { dia: 'Lun', contrataciones: 3  },
    { dia: 'Mar', contrataciones: 5  },
    { dia: 'Mié', contrataciones: 2  },
    { dia: 'Jue', contrataciones: 7  },
    { dia: 'Vie', contrataciones: 11 },
    { dia: 'Sáb', contrataciones: 18 },
    { dia: 'Dom', contrataciones: 9  },
  ];

  const radarData = [
    { metric: 'Fiabilidad',  dj: 85, staff: 78, makeup: 92 },
    { metric: 'Puntualidad', dj: 80, staff: 90, makeup: 88 },
    { metric: 'Calidad',     dj: 92, staff: 75, makeup: 95 },
    { metric: 'Precio',      dj: 70, staff: 88, makeup: 82 },
    { metric: 'Demanda',     dj: 95, staff: 65, makeup: 72 },
  ];

  return (
    <div>
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Profesionales activos', value: totalPros,             icon: Users,         color: '#D4AF37' },
          { label: 'Tarifa media/hora',     value: avgRate > 0 ? `€${avgRate}` : '—', icon: Euro, color: '#22c55e' },
          { label: 'Verificados',           value: verifiedCount,         icon: CheckCircle,   color: '#3B82F6' },
          { label: 'DJs',                   value: djCount,               icon: TrendingUp,    color: '#D4AF37' },
          { label: 'Staff',                 value: staffCount,            icon: Eye,           color: '#8B5CF6' },
          { label: 'Estilismo',             value: makeupCount,           icon: MessageSquare, color: '#F59E0B' },
          { label: 'Tus favoritos',         value: favorites.length,    icon: Heart,       color: '#EC4899' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[0.75rem] text-muted-foreground font-bold uppercase tracking-wider leading-tight">{s.label}</span>
              <s.icon size={13} style={{ color: s.color }} />
            </div>
            <span className="text-2xl font-black" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Donut */}
        <div className="glass-panel p-5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={14} style={{ color: '#D4AF37' }} /> Distribución por rol
          </h4>
          {totalPros === 0 ? (
            <div className="flex items-center justify-center h-[160px]">
              <p className="text-xs text-muted-foreground">Sin datos todavía</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={160}>
                <PieChart>
                  <Pie data={pieData.filter(d => d.value > 0)} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                    {pieData.filter(d => d.value > 0).map(entry => <Cell key={entry.name} fill={entry.color} opacity={0.9} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs font-bold">{d.name}</span>
                    <span className="text-xs text-muted-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bar — tarifa */}
        <div className="glass-panel p-5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Euro size={14} style={{ color: '#D4AF37' }} /> Tarifa media por rol
          </h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rateBarData} barSize={32} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(22,20,18,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(22,20,18,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="€/hora avg" radius={[6, 6, 0, 0]}>
                {rateBarData.map(entry => <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly sparkline */}
      <div className="glass-panel p-5 mb-5">
        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={14} style={{ color: '#D4AF37' }} /> Contrataciones esta semana
          <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
            DEMO
          </span>
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weeklyData} barSize={28} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis dataKey="dia" tick={{ fill: 'rgba(22,20,18,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(22,20,18,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(212,175,55,0.04)' }} />
            <Bar dataKey="contrataciones" radius={[4, 4, 0, 0]} fill="url(#goldGradient)" />
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4AF37" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#B8941E" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar */}
      <div className="glass-panel p-5">
        <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
          <Star size={14} style={{ color: '#D4AF37' }} /> Índice de calidad por rol
          <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
            DEMO
          </span>
        </h4>
        <p className="text-xs text-muted-foreground mb-4">Datos de referencia — se actualizará con valoraciones reales de la plataforma.</p>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(0,0,0,0.08)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(22,20,18,0.5)', fontSize: 10 }} />
            <Radar name="DJ"     dataKey="dj"     stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.15} />
            <Radar name="Staff"  dataKey="staff"  stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.12} />
            <Radar name="Makeup" dataKey="makeup" stroke="#EC4899" fill="#EC4899" fillOpacity={0.12} />
            <Tooltip content={<DarkTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2">
          {[['DJ', '#D4AF37'], ['Staff', '#8B5CF6'], ['Makeup', '#EC4899']].map(([n, c]) => (
            <div key={n} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              <span className="text-xs text-muted-foreground">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
