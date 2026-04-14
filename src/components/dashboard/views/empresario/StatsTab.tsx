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
  const premiumCount  = pros.filter(p => p.subscription_tier !== 'free').length;

  const pieData = [
    { name: 'DJ',     value: djCount     || 12, color: '#D4AF37' },
    { name: 'Staff',  value: staffCount  || 8,  color: '#8B5CF6' },
    { name: 'Makeup', value: makeupCount || 5,  color: '#EC4899' },
  ];

  const rateBarData = [
    { name: 'DJ',     '€/hora avg': avgRate                      || 280, color: '#D4AF37' },
    { name: 'Staff',  '€/hora avg': Math.round(avgRate * 0.3)    || 85,  color: '#8B5CF6' },
    { name: 'Makeup', '€/hora avg': Math.round(avgRate * 0.55)   || 160, color: '#EC4899' },
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
          { label: 'Profesionales activos', value: totalPros   || 25,  icon: Users,        color: '#D4AF37' },
          { label: 'Tarifa media/hora',     value: `€${avgRate || 195}`, icon: Euro,       color: '#22c55e' },
          { label: 'Verificados',           value: verifiedCount || 8,  icon: CheckCircle, color: '#3B82F6' },
          { label: 'Con suscripción',       value: premiumCount  || 14, icon: Star,        color: '#EC4899' },
          { label: 'DJs',                   value: djCount       || 12, icon: TrendingUp,  color: '#D4AF37' },
          { label: 'Staff',                 value: staffCount    || 8,  icon: Eye,         color: '#8B5CF6' },
          { label: 'Estilismo',             value: makeupCount   || 5,  icon: MessageSquare, color: '#F59E0B' },
          { label: 'Tus favoritos',         value: favorites.length,    icon: Heart,       color: '#EC4899' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[0.55rem] text-muted-foreground font-bold uppercase tracking-wider leading-tight">{s.label}</span>
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
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={160}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                  {pieData.map(entry => <Cell key={entry.name} fill={entry.color} opacity={0.9} />)}
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
        </div>

        {/* Bar — tarifa */}
        <div className="glass-panel p-5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Euro size={14} style={{ color: '#D4AF37' }} /> Tarifa media por rol
          </h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rateBarData} barSize={32} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
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
          <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
            DEMO
          </span>
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weeklyData} barSize={28} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="dia" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
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
          <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
            DEMO
          </span>
        </h4>
        <p className="text-xs text-muted-foreground mb-4">Datos de referencia — se actualizará con valoraciones reales de la plataforma.</p>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
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
              <span className="text-[0.65rem] text-muted-foreground">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
