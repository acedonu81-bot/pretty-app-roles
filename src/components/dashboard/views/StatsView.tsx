import { Eye, MousePointerClick, Crown, TrendingUp } from 'lucide-react';

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
          { label: 'Visualizaciones', value: '0', icon: Eye, change: '—' },
          { label: 'Clics WhatsApp', value: '0', icon: MousePointerClick, change: '—' },
          { label: 'Apariciones Directorio', value: '0', icon: Crown, change: '—' },
          { label: 'Tasa de contacto', value: '0%', icon: TrendingUp, change: '—' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
              <s.icon size={14} style={{ color: '#D4AF37' }} />
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <span className="text-[0.6rem] font-semibold text-muted-foreground">{s.change} esta semana</span>
          </div>
        ))}
      </div>

      <div className="glass-panel p-5 mb-6">
        <h3 className="text-sm font-bold mb-4">Exposición en el Directorio</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Tu posición en el directorio depende de tu plan de suscripción. Mejora tu plan para aparecer en las primeras posiciones.
        </p>
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="aspect-square rounded flex items-center justify-center text-[0.5rem] font-bold"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--nightlife-border)',
                color: 'var(--nightlife-text-secondary)',
              }}>
              {`#${i + 1}`}
            </div>
          ))}
        </div>
        <p className="text-[0.6rem] text-muted-foreground mt-3">Rotación cada 60 minutos. Activa un plan de pago para mejorar tu posición.</p>
      </div>

      <div className="glass-panel p-5">
        <h3 className="text-sm font-bold mb-3">Plan actual</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)' }}>
          <Crown size={20} style={{ color: '#8E8EA0' }} />
          <div className="flex-1">
            <p className="text-sm font-bold">Básico · Gratis</p>
            <p className="text-xs text-muted-foreground">Perfil visible en el directorio con funciones básicas.</p>
          </div>
          <span className="text-[0.55rem] font-bold px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#8E8EA0' }}>ACTIVO</span>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
