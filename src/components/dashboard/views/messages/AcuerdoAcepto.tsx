import { useState } from 'react';
import { CalendarCheck, FileText, Star, XCircle } from 'lucide-react';
import { codificarCondiciones, fechaIso, leerCondiciones, textoCondiciones, type Condiciones } from '@/lib/acuerdoChat';

// Piezas del ACEPTO del chat (16 oct 2026, ver lib/acuerdoChat.ts):
// el formulario corto de condiciones y la tarjeta de cada "Acepto".

const hoyIso = () => new Date().toISOString().slice(0, 10);

/** Formulario de 3 datos (y el evento opcional) encima de la caja de escribir. */
export const FormCondiciones = ({ inicial, otroNombre, onEnviar, onCancelar, enviando }: {
  inicial?: Condiciones | null; otroNombre: string; enviando: boolean;
  onEnviar: (codificado: string) => void; onCancelar: () => void;
}) => {
  const [fecha, setFecha] = useState(inicial ? fechaIso(inicial.fecha) : '');
  const [ciudad, setCiudad] = useState(inicial?.ciudad ?? '');
  const [precio, setPrecio] = useState(inicial?.precio ?? '');
  const [evento, setEvento] = useState(inicial?.evento ?? '');
  const precioNum = parseFloat(precio.replace(',', '.'));
  const valido = !!fecha && fecha >= hoyIso() && ciudad.trim().length >= 2 && precioNum > 0;
  const campo = 'w-full px-3 py-2 rounded-lg text-base sm:text-sm outline-none';
  const estilo = { background: '#fff', border: '1px solid rgba(0,0,0,0.12)', color: '#111' };

  return (
    <div className="mx-2 mb-2 p-3 rounded-2xl" style={{ background: '#FBF3DD', border: '1px solid rgba(212,175,55,0.45)' }}>
      <p className="text-xs font-black mb-2" style={{ color: '#5c4a12' }}>
        Condiciones del acuerdo. {otroNombre || 'La otra parte'} solo tendrá que pulsar ACEPTO.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[0.75rem] font-bold" style={{ color: '#5c4a12' }}>Fecha
          <input type="date" min={hoyIso()} value={fecha} onChange={e => setFecha(e.target.value)} className={campo} style={estilo} />
        </label>
        <label className="text-[0.75rem] font-bold" style={{ color: '#5c4a12' }}>Precio (€)
          <input type="number" inputMode="decimal" min={1} value={precio} onChange={e => setPrecio(e.target.value)} placeholder="500" className={campo} style={estilo} />
        </label>
        <label className="text-[0.75rem] font-bold" style={{ color: '#5c4a12' }}>Ciudad
          <input type="text" maxLength={60} value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Madrid" className={campo} style={estilo} />
        </label>
        <label className="text-[0.75rem] font-bold" style={{ color: '#5c4a12' }}>Evento (opcional)
          <input type="text" maxLength={60} value={evento} onChange={e => setEvento(e.target.value)} placeholder="Boda, cumpleaños…" className={campo} style={estilo} />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2 mt-3">
        <button type="button" onClick={onCancelar} className="px-3 py-2 text-xs font-bold" style={{ color: '#5c4a12' }}>Cancelar</button>
        <button type="button" disabled={!valido || enviando}
          onClick={() => onEnviar(codificarCondiciones({ fecha, ciudad, precio: String(precioNum), evento }))}
          className="px-5 py-2 rounded-full text-xs font-black disabled:opacity-40"
          style={{ background: '#059669', color: '#fff' }}>
          ACEPTO
        </button>
      </div>
    </div>
  );
};

export const MOTIVOS_CANCELACION = [
  'No puedo en esa fecha',
  'Ha cambiado el plan del evento',
  'Hemos acordado otra cosa',
  'Otro motivo',
];

export interface ReservaAcuerdo { id: string; status: string; fecha: string | null }

const diasHasta = (fechaIso: string) => {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  return Math.round((new Date(fechaIso + 'T00:00:00').getTime() - hoy.getTime()) / 86_400_000);
};

/** Tarjeta de un "Acepto" en el chat. Cerrado = estado de la reserva (estilo
 *  Wallapop): fecha y cuenta atrás, cancelar con confirmación, y "Valorar" cuando
 *  pasa el evento. */
export const TarjetaAcepto = ({ resumen, isMe, otroNombre, cerrado, pendienteActual, reserva, onProponerOtras, onContrato, onNuevoAcuerdo, onCancelar, onValorar }: {
  resumen: string; isMe: boolean; otroNombre: string; cerrado: boolean; pendienteActual: boolean;
  reserva?: ReservaAcuerdo | null;
  onProponerOtras?: (c: Condiciones | null) => void; onContrato?: (c: Condiciones | null) => void;
  onNuevoAcuerdo?: () => void; onCancelar?: (reservaId: string, motivo: string) => void; onValorar?: () => void;
}) => {
  const [confirmando, setConfirmando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const cond = leerCondiciones(resumen);
  const texto = textoCondiciones(cond);
  const quien = otroNombre || 'La otra parte';
  const cancelado = cerrado && reserva?.status === 'cancelled';
  const dias = cerrado && reserva?.fecha ? diasHasta(reserva.fecha) : null;
  const pasado = dias !== null && dias < 0;
  return (
    <div className="px-4 py-3 rounded-2xl text-sm max-w-[290px]"
      style={{ background: cancelado ? '#F3F4F6' : cerrado ? '#ECFDF5' : '#FBF3DD', border: `1px solid ${cancelado ? 'rgba(0,0,0,0.12)' : cerrado ? 'rgba(5,150,105,0.4)' : 'rgba(212,175,55,0.5)'}`, color: '#3d300a' }}>
      <p className="font-black">{isMe ? 'Acepto' : `${quien} acepta`}</p>
      {texto && <p className="text-xs mt-0.5 font-semibold">{texto}</p>}
      {cancelado ? (
        <p className="flex items-center gap-1 text-xs mt-1.5 font-bold" style={{ color: '#6B7280' }}>
          <XCircle size={13} /> Acuerdo cancelado
        </p>
      ) : cerrado ? (
        <>
          <p className="text-xs mt-1.5 font-bold" style={{ color: '#059669' }}>Acuerdo cerrado por los dos</p>
          <p className="flex items-center gap-1 text-[0.75rem] mt-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
            <CalendarCheck size={12} />
            {dias === null ? 'Guardado en reservas y en el calendario'
              : dias > 1 ? `Faltan ${dias} días · en tu calendario`
              : dias === 1 ? 'Es mañana · en tu calendario'
              : dias === 0 ? 'Es hoy' : 'El evento ya pasó'}
          </p>
          {pasado && onValorar && (
            <button type="button" onClick={onValorar}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
              style={{ background: '#059669', color: '#fff' }}>
              <Star size={13} /> ¿Cómo fue? Valorar
            </button>
          )}
          {onContrato && !pasado && (
            <button type="button" onClick={() => onContrato(cond)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#fff', border: '1px solid rgba(5,150,105,0.4)', color: '#047857' }}>
              <FileText size={13} /> Descargar contrato (opcional)
            </button>
          )}
          {onCancelar && reserva && !pasado && (confirmando ? (
            <div className="mt-2 p-2 rounded-xl" style={{ background: '#fff', border: '1px solid rgba(220,38,38,0.3)' }}>
              <p className="text-xs font-bold" style={{ color: '#991b1b' }}>¿Cancelar el acuerdo? Se avisará a {quien}.</p>
              <select value={motivo} onChange={e => setMotivo(e.target.value)} aria-label="Motivo de la cancelación"
                className="mt-1.5 w-full px-2 py-1.5 rounded-lg text-base sm:text-xs outline-none" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.15)', color: '#111' }}>
                <option value="">Motivo (opcional)</option>
                {MOTIVOS_CANCELACION.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div className="flex gap-2 mt-1.5">
                <button type="button" onClick={() => { setConfirmando(false); onCancelar(reserva.id, motivo); }}
                  className="px-3 py-1.5 rounded-full text-xs font-black" style={{ background: '#dc2626', color: '#fff' }}>Sí, cancelar</button>
                <button type="button" onClick={() => setConfirmando(false)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ color: '#444' }}>No</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmando(true)} className="block mt-2 text-xs font-bold underline" style={{ color: '#991b1b' }}>
              Cancelar acuerdo
            </button>
          ))}
          {onNuevoAcuerdo && (
            <button type="button" onClick={onNuevoAcuerdo} className="block mt-2 text-xs font-bold underline" style={{ color: '#047857' }}>
              Nuevo acuerdo
            </button>
          )}
        </>
      ) : pendienteActual ? (
        isMe ? (
          <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.55)' }}>Falta que {quien} acepte</p>
        ) : (
          <>
            <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.55)' }}>Pulsa ACEPTO para cerrar el acuerdo</p>
            {onProponerOtras && (
              <button type="button" onClick={() => onProponerOtras(cond)} className="mt-1 text-xs font-bold underline" style={{ color: '#8B6A00' }}>
                Proponer otras condiciones
              </button>
            )}
          </>
        )
      ) : (
        <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.45)' }}>Sustituido por otra propuesta</p>
      )}
    </div>
  );
};
