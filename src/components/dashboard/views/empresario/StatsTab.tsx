import { Star, Users, Euro, BarChart3, Eye, MessageSquare, CheckCircle, Heart, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
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

  const pieData = [
    { name: 'DJ',     value: djCount,     color: '#8A6D0F' },
    { name: 'Staff',  value: staffCount,  color: '#8B5CF6' },
    { name: 'Makeup', value: makeupCount, color: '#EC4899' },
  ];

  const djAvgRate     = pros.filter(p => p.role === 'dj').reduce((s, p) => s + (p.hourly_rate || 0), 0) / (djCount || 1);
  const staffAvgRate  = pros.filter(p => p.role === 'staff').reduce((s, p) => s + (p.hourly_rate || 0), 0) / (staffCount || 1);
  const makeupAvgRate = pros.filter(p => p.role === 'makeup').reduce((s, p) => s + (p.hourly_rate || 0), 0) / (makeupCount || 1);
  const rateBarData = [
    { name: 'DJ',     '€/hora avg': djCount     > 0 ? Math.round(djAvgRate)     : 0, color: '#8A6D0F' },
    { name: 'Staff',  '€/hora avg': staffCount  > 0 ? Math.round(staffAvgRate)  : 0, color: '#8B5CF6' },
    { name: 'Makeup', '€/hora avg': makeupCount > 0 ? Math.round(makeupAvgRate) : 0, color: '#EC4899' },
  ];

  return (
    <div>
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Profesionales activos', value: totalPros,             icon: Users,         color: '#8A6D0F' },
          { label: 'Tarifa media/hora',     value: avgRate > 0 ? `€${avgRate}` : '—', icon: Euro, color: '#22c55e' },
          { label: 'DJs',                   value: djCount,               icon: TrendingUp,    color: '#8A6D0F' },
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
            <BarChart3 size={14} style={{ color: '#8A6D0F' }} /> Distribución por rol
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
            <Euro size={14} style={{ color: '#8A6D0F' }} /> Tarifa media por rol
          </h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rateBarData} barSize={32} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#333', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#333', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="€/hora avg" radius={[6, 6, 0, 0]}>
                {rateBarData.map(entry => <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contrataciones por semana — estado vacío honesto hasta tener datos reales.
          Antes mostraba un gráfico con valores inventados (Lun 3, Sáb 18…) bajo un
          badge "DEMO"; la regla del proyecto es no exhibir cifras generadas como
          si fueran datos del empresario. */}
      <div className="glass-panel p-5 mb-5">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <TrendingUp size={14} style={{ color: '#8A6D0F' }} /> Contrataciones por semana
        </h4>
        <div className="py-8 text-center rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
          <p className="text-sm font-bold" style={{ color: '#333' }}>Aún sin actividad</p>
          <p className="text-xs mt-1" style={{ color: '#666' }}>Cuando empieces a contratar profesionales, verás aquí tu ritmo semanal real.</p>
        </div>
      </div>

      {/* Índice de calidad por rol — se mostrará cuando existan valoraciones reales.
          Antes: radar con valores fijos por rol (Fiabilidad 85, etc.) marcado "DEMO". */}
      <div className="glass-panel p-5">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Star size={14} style={{ color: '#8A6D0F' }} /> Índice de calidad por rol
        </h4>
        <div className="py-8 text-center rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
          <p className="text-sm font-bold" style={{ color: '#333' }}>Todavía no hay valoraciones suficientes</p>
          <p className="text-xs mt-1" style={{ color: '#666' }}>Este índice se construye con las reseñas reales de la plataforma. Aparecerá en cuanto haya datos.</p>
        </div>
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
