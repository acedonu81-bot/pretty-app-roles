import { Euro } from 'lucide-react';
import { PAYMENT_BENCHMARK } from './types';

/**
 * Tarifas orientativas del sector para ayudar a un empresario nuevo a situarse.
 * Antes este tab mostraba además unos porcentajes de forma de pago (Efectivo 42%,
 * Transferencia 51%…) hardcodeados y presentados bajo el título "¿Cómo pagan otros
 * empresarios?" — datos inventados sin fuente que se leían como métricas reales de
 * la plataforma. Se han retirado: se mantiene solo el rango de tarifas, etiquetado
 * honestamente como orientativo, y se retirará por completo en favor de datos reales
 * cuando haya volumen de transacciones.
 */
const BenchmarkTab = () => (
  <div>
    <div className="glass-panel p-5 mb-4" style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.02)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Euro size={14} style={{ color: '#8A6D0F' }} />
        <h4 className="text-sm font-bold">Tarifas orientativas del sector</h4>
        <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
          Orientativo
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-5">Rangos de referencia para hacerte una idea antes de negociar. No son datos de la plataforma; se sustituirán por tarifas reales cuando haya suficientes contrataciones.</p>
      <div className="space-y-5">
        {PAYMENT_BENCHMARK.map(b => (
          <div key={b.role} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold">{b.role}</p>
              <span className="text-lg font-black" style={{ color: '#8A6D0F' }}>
                €{b.min}–{b.max}<span className="text-xs font-normal text-muted-foreground">/sesión</span>
              </span>
            </div>
            <div className="h-2 rounded-full relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
              <div className="absolute top-0 bottom-0 rounded-full"
                style={{
                  left: '8%',
                  right: '8%',
                  background: 'linear-gradient(90deg, rgba(212,175,55,0.25), rgba(212,175,55,0.7))',
                }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[0.75rem] text-muted-foreground mt-4 text-center">Rangos orientativos del sector nightlife en España · No representan transacciones reales</p>
    </div>
  </div>
);

export default BenchmarkTab;
