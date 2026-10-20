import { PERSONAS_OPCIONES } from '@/lib/solicitudCompleta';

/**
 * Número aproximado de personas y horario (20 oct 2026): con esto un profesional puede
 * contestar con un precio. Sin ellos no se manda la solicitud (ver faltanDatos).
 */
export default function CamposPersonasHorario({ personas, horario, onPersonas, onHorario }: {
  personas: string; horario: string; onPersonas: (v: string) => void; onHorario: (v: string) => void;
}) {
  const estilo = { background: '#f9f8f6', border: '1px solid rgba(0,0,0,0.1)', color: '#222' } as const;
  const etiqueta = 'text-xs font-bold mb-1 block';
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={etiqueta} style={{ color: '#222' }}>Personas (aprox.) *</label>
        <select value={personas} onChange={e => onPersonas(e.target.value)} required
          className="w-full px-3 py-2.5 rounded-xl text-base outline-none appearance-none" style={estilo}>
          <option value="">Elige</option>
          {PERSONAS_OPCIONES.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className={etiqueta} style={{ color: '#222' }}>Horario *</label>
        <input value={horario} onChange={e => onHorario(e.target.value)} placeholder="De 22:00 a 03:00" required maxLength={40}
          className="w-full px-3 py-2.5 rounded-xl text-base outline-none" style={estilo} />
      </div>
    </div>
  );
}
