import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { cobrosActivos } from '@/lib/pagos';
import {
  borrarEvento, crearEvento, listarMisEventos, marcaDe, pedirConfirmacion, puedePedirConfirmacion,
  type EventoTrayectoria,
} from '@/lib/trayectoria';

const MENSAJES: Record<string, string> = {
  correo_propio: 'Tiene que ser el correo del organizador, no el tuyo.',
  correo_invalido: 'Ese correo no parece válido.',
  limite_correo: 'Ese correo ya ha recibido varias solicitudes este mes.',
  ya_pendiente: 'Ya le enviamos la solicitud hace poco. Dale un día.',
  no_premium: 'Pedir confirmación es una ventaja de Premium.',
  cobros_apagados: 'Todavía no está disponible.',
};

const campo = 'w-full rounded-lg px-3 py-2 text-sm';
const estiloCampo = { background: '#FFFDF7', border: '1px solid rgba(122,98,22,.25)', color: '#111' };

// Trayectoria del profesional (22 nov 2026): eventos en los que ha trabajado.
// Todos los planes los añaden y se enseñan como "Declarado"; pedir al organizador
// que los confirme es ventaja de Premium (y solo con los cobros activos).
export default function TrayectoriaEditor() {
  const { subscription_tier } = useProfile();
  const puedePedir = puedePedirConfirmacion(subscription_tier, cobrosActivos());
  const [eventos, setEventos] = useState<EventoTrayectoria[] | null>(null);
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [pidiendo, setPidiendo] = useState<string | null>(null);
  const [correo, setCorreo] = useState('');

  const cargar = useCallback(() => { listarMisEventos().then(setEventos).catch(() => setEventos([])); }, []);
  useEffect(cargar, [cargar]);

  const anadir = async () => {
    if (titulo.trim().length < 3 || !fecha) { toast.error('Pon el nombre del evento y la fecha.'); return; }
    setGuardando(true);
    try {
      await crearEvento({ titulo: titulo.trim(), fecha, ciudad: ciudad.trim() || null });
      setTitulo(''); setFecha(''); setCiudad('');
      toast.success('Evento añadido a tu trayectoria.');
      cargar();
    } catch { toast.error('No se pudo añadir el evento. Inténtalo de nuevo.'); }
    setGuardando(false);
  };

  const enviar = async (id: string) => {
    try {
      await pedirConfirmacion(id, correo.trim());
      toast.success('Hemos enviado la solicitud al organizador.');
      setPidiendo(null); setCorreo(''); cargar();
    } catch (e) {
      toast.error(MENSAJES[(e as Error).message] ?? 'No se pudo enviar la solicitud.');
    }
  };

  return (
    <div className="glass-panel p-5" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
      <h3 className="text-base font-black mb-1" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>Tu trayectoria</h3>
      <p className="text-xs mb-4" style={{ color: '#6b6454' }}>
        Los eventos en los que has trabajado aparecen en tu ficha pública.
        {puedePedir ? ' Pide al organizador que los confirme y saldrán con el sello de confirmado.' : ''}
      </p>

      <ul className="flex flex-col gap-2 mb-4">
        {(eventos ?? []).map(e => (
          <li key={e.id} className="rounded-xl p-3" style={{ background: '#FFFDF7', border: '1px solid rgba(122,98,22,.15)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">{e.titulo}</p>
                <p className="text-xs" style={{ color: '#6b6454' }}>{[e.fecha, e.ciudad].filter(Boolean).join(' · ')}</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                style={e.estado === 'confirmado' || e.origen === 'xpeak'
                  ? { background: 'rgba(212,175,55,.18)', color: '#8B6A00' } : { background: '#F3F4F6', color: '#4B5563' }}>
                {marcaDe(e)}
              </span>
            </div>
            <div className="flex gap-3 mt-2">
              {puedePedir && e.estado !== 'confirmado' && e.origen !== 'xpeak' && (
                <button type="button" className="text-xs font-bold underline" style={{ color: '#8B6A00' }}
                  onClick={() => { setPidiendo(pidiendo === e.id ? null : e.id); setCorreo(''); }}>
                  Pedir confirmación
                </button>
              )}
              <button type="button" className="text-xs underline" style={{ color: '#6b6454' }}
                onClick={() => { borrarEvento(e.id).then(cargar).catch(() => toast.error('No se pudo borrar.')); }}>
                Borrar
              </button>
            </div>
            {pidiendo === e.id && (
              <div className="flex gap-2 mt-3">
                <input type="email" aria-label="Correo del organizador" placeholder="Correo del organizador" value={correo}
                  onChange={ev => setCorreo(ev.target.value)} className={campo} style={estiloCampo} />
                <button type="button" onClick={() => enviar(e.id)} className="rounded-lg px-4 text-sm font-bold whitespace-nowrap"
                  style={{ background: '#D4AF37', color: '#1d1a12' }}>Enviar</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-xs font-bold">Nombre del evento
          <input className={campo} style={estiloCampo} value={titulo} maxLength={120} onChange={e => setTitulo(e.target.value)} />
        </label>
        <label className="text-xs font-bold">Fecha
          <input type="date" className={campo} style={estiloCampo} value={fecha} onChange={e => setFecha(e.target.value)} />
        </label>
        <label className="text-xs font-bold">Ciudad
          <input className={campo} style={estiloCampo} value={ciudad} maxLength={80} onChange={e => setCiudad(e.target.value)} />
        </label>
      </div>
      <button type="button" onClick={anadir} disabled={guardando} className="mt-3 rounded-xl px-5 py-2 text-sm font-bold"
        style={{ background: '#D4AF37', color: '#1d1a12' }}>Añadir evento</button>
    </div>
  );
}
