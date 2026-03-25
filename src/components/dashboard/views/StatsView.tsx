import { useState } from 'react';
import { Zap, Eye, MousePointerClick, Crown, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

const StatsView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">
          Mis <span className="text-gradient">Estadísticas</span>
        </h2>
        <p className="text-sm text-muted-foreground">Métricas de rendimiento de tu perfil en el directorio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Visualizaciones', value: '1,247', icon: Eye, change: '+12%' },
          { label: 'Clics WhatsApp', value: '89', icon: MousePointerClick, change: '+8%' },
          { label: 'Apariciones Elite', value: '342', icon: Crown, change: '+23%' },
          { label: 'Tasa de contacto', value: '7.1%', icon: TrendingUp, change: '+2.3%' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
              <s.icon size={14} style={{ color: '#D4AF37' }} />
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <span className="text-[0.6rem] font-semibold" style={{ color: '#22c55e' }}>{s.change} esta semana</span>
          </div>
        ))}
      </div>

      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-4">Exposición en la Cuadrícula Principal</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Como usuario Elite (24,95€/mes), tu perfil rota en las 12 posiciones principales cada hora.
          Esta semana has aparecido <strong className="text-foreground">342 veces</strong> en la primera página.
        </p>
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="aspect-square rounded flex items-center justify-center text-[0.5rem] font-bold"
              style={{
                background: i < 4 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                border: i < 4 ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--nightlife-border)',
                color: i < 4 ? '#D4AF37' : 'var(--nightlife-text-secondary)',
              }}>
              {i < 4 ? 'TÚ' : `#${i + 1}`}
            </div>
          ))}
        </div>
        <p className="text-[0.6rem] text-muted-foreground mt-3">Rotación cada 60 minutos. 12 perfiles Elite visibles por página.</p>
      </div>

      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold mb-3">Plan actual</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <Crown size={20} style={{ color: '#D4AF37' }} />
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>Elite · 24,95€/mes</p>
            <p className="text-xs text-muted-foreground">Posicionamiento prioritario + TOP Weekend + Estadísticas avanzadas</p>
          </div>
          <span className="text-[0.55rem] font-bold px-2 py-1 rounded" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>ACTIVO</span>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
