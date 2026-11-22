import { marcaDe, type EventoTrayectoria } from '@/lib/trayectoria';

const fechaCorta = (f: string) => {
  const d = new Date(`${f}T12:00:00`);
  return Number.isNaN(d.getTime()) ? f : d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
};

const esFuerte = (e: Pick<EventoTrayectoria, 'estado' | 'origen'>) => e.estado === 'confirmado' || e.origen === 'xpeak';

// Trayectoria en la ficha pública (22 nov 2026). La marca explica qué prueba
// hay: Declarado (lo dice el profesional), Confirmado (el organizador lo
// confirmó) o Contrato XPEAK. Solo se pintan los campos públicos del evento.
export default function TrayectoriaSection({ eventos }: { eventos: EventoTrayectoria[] }) {
  if (!eventos.length) return null;
  const fuertes = eventos.filter(esFuerte).length;
  return (
    <section aria-label="Trayectoria" className="rounded-2xl p-5" style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.3)' }}>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#8B6A00' }}>Trayectoria</h2>
        <p className="text-xs" style={{ color: '#6b6454' }}>{`${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'}${fuertes ? ` · ${fuertes} ${fuertes === 1 ? 'confirmado' : 'confirmados'}` : ''}`}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {eventos.map(e => (
          <li key={e.id} className="flex items-start justify-between gap-3 rounded-xl p-3" style={{ background: '#fff', border: '1px solid rgba(122,98,22,.12)' }}>
            <div>
              <p className="text-sm font-bold" style={{ color: '#111' }}>{e.titulo}</p>
              <p className="text-xs" style={{ color: '#6b6454' }}>{[fechaCorta(e.fecha), e.lugar, e.ciudad].filter(Boolean).join(' · ')}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
              style={esFuerte(e) ? { background: 'rgba(212,175,55,.2)', color: '#8B6A00' } : { background: '#F3F4F6', color: '#4B5563' }}>
              {marcaDe(e)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
