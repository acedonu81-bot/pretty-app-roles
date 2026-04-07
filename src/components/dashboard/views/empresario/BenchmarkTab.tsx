import { Euro } from 'lucide-react';
import { PAYMENT_BENCHMARK } from './types';

const BenchmarkTab = () => (
  <div>
    <div className="glass-panel p-5 mb-4" style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.02)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Euro size={14} style={{ color: '#D4AF37' }} />
        <h4 className="text-sm font-bold">¿Cómo pagan otros empresarios?</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-5">Datos anonimizados de contratos gestionados en la plataforma.</p>
      <div className="space-y-5">
        {PAYMENT_BENCHMARK.map(b => (
          <div key={b.role} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold">{b.role}</p>
              <span className="text-lg font-black" style={{ color: '#D4AF37' }}>
                €{b.avg}<span className="text-xs font-normal text-muted-foreground">/sesión avg</span>
              </span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-[0.6rem] text-muted-foreground mb-1">
                <span>Mínimo €{b.min}</span><span>Máximo €{b.max}</span>
              </div>
              <div className="h-2 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="absolute top-0 bottom-0 w-1 rounded-full"
                  style={{
                    left: `${((b.avg - b.min) / (b.max - b.min)) * 100}%`,
                    background: '#D4AF37',
                    boxShadow: '0 0 6px rgba(212,175,55,0.8)',
                  }} />
              </div>
            </div>
            <p className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wider mb-2">Forma de pago</p>
            <div className="flex gap-2">
              {[
                { label: 'Efectivo',       pct: b.pct_cash,     color: '#22c55e' },
                { label: 'Transferencia',  pct: b.pct_transfer,  color: '#3B82F6' },
                { label: 'Plataforma',     pct: b.pct_platform,  color: '#D4AF37' },
              ].map(m => (
                <div key={m.label} className="flex-1 rounded-lg p-2 text-center"
                  style={{ background: `${m.color}10`, border: `1px solid ${m.color}22` }}>
                  <p className="text-sm font-black" style={{ color: m.color }}>{m.pct}%</p>
                  <p className="text-[0.5rem] text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[0.55rem] text-muted-foreground mt-4 text-center">Datos basados en contratos anteriores. Actualizado mensualmente.</p>
    </div>
  </div>
);

export default BenchmarkTab;
