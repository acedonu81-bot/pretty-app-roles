import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clock, Wallet, Ban, Shirt, CalendarX, Car, Check, Eye } from 'lucide-react';

/**
 * "Mis condiciones" — el profesional fija las reglas, no las acepta.
 *
 * Un camarero de eventos hoy no controla casi nada: le dicen la tarifa, el
 * turno, cuánto dura y cuándo cobra. Y si rechaza dos servicios, dejan de
 * llamarle. Esta pantalla le da la vuelta a eso: escribe sus condiciones y
 * quien contrata las lee ANTES de escribirle.
 *
 * Va por bloques y no en un formulario único a propósito: el alta ya es larga y
 * un muro de 14 campos se abandona a la mitad. Cada bloque se guarda solo.
 *
 * La vista previa de la derecha es el punto entero de la pantalla: mientras
 * escribe, ve el pliego que va a leer quien le contrate. Sin eso esto sería un
 * formulario más; con eso es "esto lo pongo yo".
 */

interface Props {
  profile: any;
  onSaved?: () => void;
}

const SERVICIOS_EXCLUIBLES = [
  'Montaje de mobiliario', 'Desmontaje', 'Limpieza de sala', 'Office / fregado',
  'Carga y descarga', 'Cocina', 'Servir en barra libre', 'Recogida al cierre',
];

const DIAS = [
  { n: 1, l: 'L' }, { n: 2, l: 'M' }, { n: 3, l: 'X' }, { n: 4, l: 'J' },
  { n: 5, l: 'V' }, { n: 6, l: 'S' }, { n: 7, l: 'D' },
];

export default function MisCondicionesSection({ profile, onSaved }: Props) {
  const [f, setF] = useState({
    hourly_rate:            profile?.hourly_rate ?? '',
    min_hours:              profile?.min_hours ?? '',
    overtime_after_hours:   profile?.overtime_after_hours ?? '',
    overtime_surcharge_pct: profile?.overtime_surcharge_pct ?? '',
    night_surcharge_pct:    profile?.night_surcharge_pct ?? '',
    holiday_surcharge_pct:  profile?.holiday_surcharge_pct ?? '',
    payment_days_max:       profile?.payment_days_max ?? '',
    travel_free_km:         profile?.travel_free_km ?? '',
    travel_fee:             profile?.travel_fee ?? '',
    min_notice_hours:       profile?.min_notice_hours ?? '',
    uniform_provided_by:    profile?.uniform_provided_by ?? '',
    excluded_services:      (profile?.excluded_services ?? []) as string[],
    available_weekdays:     (profile?.available_weekdays ?? []) as number[],
    conditions_note:        profile?.conditions_note ?? '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  const toggleEnLista = (k: 'excluded_services' | 'available_weekdays', v: any) =>
    setF(p => {
      const lista = p[k] as any[];
      return { ...p, [k]: lista.includes(v) ? lista.filter(x => x !== v) : [...lista, v] };
    });

  // Cuántas condiciones ha declarado. Da la sensación de progreso sin
  // convertirlo en una barra obligatoria: nada aquí es requisito.
  const declaradas = useMemo(() => {
    const campos = [
      f.hourly_rate, f.min_hours, f.payment_days_max, f.uniform_provided_by,
      f.min_notice_hours, f.overtime_surcharge_pct, f.travel_free_km,
    ].filter(v => v !== '' && v !== null && v !== undefined).length;
    return campos + (f.excluded_services.length ? 1 : 0) + (f.available_weekdays.length ? 1 : 0);
  }, [f]);

  const guardar = async () => {
    setSaving(true);
    const num = (v: any) => (v === '' || v === null ? null : Number(v));
    // hourly_rate solo se toca si hay valor: con `?? 0`, un camarero que tenía
    // 20 €/h y solo venía a marcar sus días disponibles se quedaba a 0 €/h.
    const tarifa = num(f.hourly_rate);
    const { error } = await supabase.from('profiles').update({
      ...(tarifa != null ? { hourly_rate: tarifa } : {}),
      min_hours:              num(f.min_hours),
      overtime_after_hours:   num(f.overtime_after_hours),
      overtime_surcharge_pct: num(f.overtime_surcharge_pct),
      night_surcharge_pct:    num(f.night_surcharge_pct),
      holiday_surcharge_pct:  num(f.holiday_surcharge_pct),
      payment_days_max:       num(f.payment_days_max),
      travel_free_km:         num(f.travel_free_km),
      travel_fee:             num(f.travel_fee),
      min_notice_hours:       num(f.min_notice_hours),
      uniform_provided_by:    f.uniform_provided_by || null,
      excluded_services:      f.excluded_services.length ? f.excluded_services : null,
      available_weekdays:     f.available_weekdays.length ? f.available_weekdays.sort() : null,
      conditions_note:        f.conditions_note?.trim() || null,
    } as any).eq('user_id', profile.user_id);
    setSaving(false);
    if (error) { toast.error('No se pudieron guardar tus condiciones'); return; }
    toast.success('Condiciones actualizadas — ya las ve quien quiera contratarte');
    onSaved?.();
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm outline-none';
  const inputSty = { background: '#fff', border: '1px solid rgba(0,0,0,0.12)', color: '#111' } as const;

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

      {/* ── Formulario, por bloques ── */}
      <div className="space-y-5">

        <div>
          <h3 className="text-xl font-black" style={{ color: '#111' }}>Mis condiciones</h3>
          <p className="text-sm mt-1" style={{ color: '#555' }}>
            Aquí decides tú. Quien quiera contratarte lee esto <strong>antes</strong> de escribirte,
            así no tienes que negociarlo cada vez.
          </p>
          {declaradas > 0 && (
            <p className="text-xs font-bold mt-2" style={{ color: '#16a34a' }}>
              {declaradas} {declaradas === 1 ? 'condición puesta' : 'condiciones puestas'}
            </p>
          )}
        </div>

        {/* Dinero */}
        <Bloque icon={Wallet} titulo="Lo que cobras" nota="Tu tarifa la pones tú. Nadie la negocia por debajo.">
          <div className="grid sm:grid-cols-2 gap-3">
            <Campo label="Tu tarifa por hora" sufijo="€/h">
              <input type="number" min={0} className={inputCls} style={inputSty}
                value={f.hourly_rate} onChange={e => set('hourly_rate', e.target.value)} placeholder="18" />
            </Campo>
            <Campo label="Mínimo de horas" nota="No te mueves por menos" sufijo="h">
              <input type="number" min={1} max={24} className={inputCls} style={inputSty}
                value={f.min_hours} onChange={e => set('min_hours', e.target.value)} placeholder="4" />
            </Campo>
            <Campo label="Horas extra a partir de la" sufijo="ª">
              <input type="number" min={1} max={24} className={inputCls} style={inputSty}
                value={f.overtime_after_hours} onChange={e => set('overtime_after_hours', e.target.value)} placeholder="8" />
            </Campo>
            <Campo label="Recargo por hora extra" sufijo="%">
              <input type="number" min={0} max={200} className={inputCls} style={inputSty}
                value={f.overtime_surcharge_pct} onChange={e => set('overtime_surcharge_pct', e.target.value)} placeholder="25" />
            </Campo>
            <Campo label="Recargo nocturno" sufijo="%">
              <input type="number" min={0} max={200} className={inputCls} style={inputSty}
                value={f.night_surcharge_pct} onChange={e => set('night_surcharge_pct', e.target.value)} placeholder="20" />
            </Campo>
            <Campo label="Recargo festivos" sufijo="%">
              <input type="number" min={0} max={200} className={inputCls} style={inputSty}
                value={f.holiday_surcharge_pct} onChange={e => set('holiday_surcharge_pct', e.target.value)} placeholder="50" />
            </Campo>
          </div>
        </Bloque>

        {/* Cobro */}
        <Bloque icon={Clock} titulo="Cuándo cobras" nota="La queja número uno del sector. Dilo por delante.">
          <Campo label="Cobro como máximo a" sufijo="días">
            <input type="number" min={0} max={120} className={inputCls} style={inputSty}
              value={f.payment_days_max} onChange={e => set('payment_days_max', e.target.value)} placeholder="7" />
          </Campo>
        </Bloque>

        {/* Lo que NO hace */}
        <Bloque icon={Ban} titulo="Lo que NO haces" nota="Marca lo que no entra en tu tarifa. Sin discusiones el día del evento.">
          <div className="flex flex-wrap gap-2">
            {SERVICIOS_EXCLUIBLES.map(s => {
              const on = f.excluded_services.includes(s);
              return (
                <button key={s} type="button" onClick={() => toggleEnLista('excluded_services', s)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={on
                    ? { background: 'rgba(185,28,28,0.1)', border: '1.5px solid #b91c1c', color: '#b91c1c' }
                    : { background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)', color: '#555' }}>
                  {on ? '✕ ' : ''}{s}
                </button>
              );
            })}
          </div>
        </Bloque>

        {/* Uniforme y desplazamiento */}
        <Bloque icon={Shirt} titulo="Uniforme y desplazamiento">
          <div className="grid sm:grid-cols-2 gap-3">
            <Campo label="El uniforme lo pone">
              <select className={inputCls} style={inputSty}
                value={f.uniform_provided_by} onChange={e => set('uniform_provided_by', e.target.value)}>
                <option value="">Sin especificar</option>
                <option value="propio">Yo (traje propio)</option>
                <option value="cliente">El cliente</option>
                <option value="ambos">Indiferente</option>
              </select>
            </Campo>
            <Campo label="Antelación mínima" sufijo="h">
              <input type="number" min={0} className={inputCls} style={inputSty}
                value={f.min_notice_hours} onChange={e => set('min_notice_hours', e.target.value)} placeholder="24" />
            </Campo>
            <Campo label="Me desplazo gratis hasta" sufijo="km">
              <input type="number" min={0} className={inputCls} style={inputSty}
                value={f.travel_free_km} onChange={e => set('travel_free_km', e.target.value)} placeholder="20" />
            </Campo>
            <Campo label="Más lejos, cobro" sufijo="€">
              <input type="number" min={0} className={inputCls} style={inputSty}
                value={f.travel_fee} onChange={e => set('travel_fee', e.target.value)} placeholder="15" />
            </Campo>
          </div>
        </Bloque>

        {/* Disponibilidad */}
        <Bloque icon={CalendarX} titulo="Cuándo trabajas" nota="Rechaza lo que no te encaje. Aquí nadie deja de llamarte por eso.">
          <div className="flex gap-2">
            {DIAS.map(d => {
              const on = f.available_weekdays.includes(d.n);
              return (
                <button key={d.n} type="button" onClick={() => toggleEnLista('available_weekdays', d.n)}
                  className="w-10 h-10 rounded-xl text-sm font-black transition-all"
                  style={on
                    ? { background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }
                    : { background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)', color: '#777' }}>
                  {d.l}
                </button>
              );
            })}
          </div>
        </Bloque>

        {/* Nota libre */}
        <Bloque icon={Check} titulo="Algo más">
          <textarea rows={3} className={inputCls} style={inputSty}
            value={f.conditions_note} onChange={e => set('conditions_note', e.target.value)}
            placeholder="Ej: Nochevieja y Nochebuena no trabajo. Para bodas de más de 150 invitados, mínimo 6 horas." />
        </Bloque>

        <button onClick={guardar} disabled={saving}
          className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          {saving ? 'Guardando…' : 'Guardar mis condiciones'}
        </button>
      </div>

      {/* ── Vista previa: lo que ve quien contrata ── */}
      <div className="lg:sticky lg:top-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Eye size={13} style={{ color: '#777' }} />
          <p className="text-[0.7rem] font-black uppercase tracking-wider" style={{ color: '#777' }}>
            Así lo ve quien te contrata
          </p>
        </div>

        <div className="rounded-2xl p-5" style={{ background: '#0a0908', color: '#fff' }}>
          <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>
            Mis condiciones
          </p>

          {declaradas === 0 ? (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Todavía no has puesto ninguna. Según las rellenes, aparecerán aquí.
            </p>
          ) : (
            <ul className="space-y-2.5 text-sm">
              {f.hourly_rate !== '' && (
                <Linea destacada>{f.hourly_rate} €/hora
                  {f.min_hours !== '' && <> · mínimo {f.min_hours} h</>}
                </Linea>
              )}
              {f.overtime_surcharge_pct !== '' && (
                <Linea>A partir de la {f.overtime_after_hours || '8'}ª hora: +{f.overtime_surcharge_pct}%</Linea>
              )}
              {f.night_surcharge_pct !== '' && <Linea>Recargo nocturno: +{f.night_surcharge_pct}%</Linea>}
              {f.holiday_surcharge_pct !== '' && <Linea>Festivos: +{f.holiday_surcharge_pct}%</Linea>}
              {f.payment_days_max !== '' && (
                <Linea destacada>Cobro máximo a {f.payment_days_max} días</Linea>
              )}
              {f.uniform_provided_by && (
                <Linea>Uniforme: {f.uniform_provided_by === 'propio' ? 'lo pongo yo'
                  : f.uniform_provided_by === 'cliente' ? 'lo pone el cliente' : 'indiferente'}</Linea>
              )}
              {f.travel_free_km !== '' && (
                <Linea>Desplazamiento gratis hasta {f.travel_free_km} km
                  {f.travel_fee !== '' && <> · después +{f.travel_fee} €</>}
                </Linea>
              )}
              {f.min_notice_hours !== '' && <Linea>Avísame con {f.min_notice_hours} h de antelación</Linea>}
              {f.available_weekdays.length > 0 && (
                <Linea>Disponible: {DIAS.filter(d => f.available_weekdays.includes(d.n)).map(d => d.l).join(' · ')}</Linea>
              )}
              {f.excluded_services.length > 0 && (
                <li className="pt-1">
                  <p className="text-[0.7rem] font-black uppercase tracking-wider mb-1.5"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>No incluye</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.excluded_services.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[0.7rem] font-bold"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>{s}</span>
                    ))}
                  </div>
                </li>
              )}
              {f.conditions_note?.trim() && (
                <li className="pt-1 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {f.conditions_note}
                </li>
              )}
            </ul>
          )}
        </div>

        <p className="text-[0.7rem] mt-2.5 leading-relaxed" style={{ color: '#777' }}>
          Quien te escriba habrá leído esto antes. Si no le encaja, no te hace perder el tiempo.
        </p>
      </div>
    </div>
  );
}

const Bloque = ({ icon: Icon, titulo, nota, children }: {
  icon: any; titulo: string; nota?: string; children: React.ReactNode;
}) => (
  <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
    <div className="flex items-start gap-2.5 mb-3">
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F' }}>
        <Icon size={14} strokeWidth={2.5} />
      </span>
      <div>
        <p className="text-sm font-black" style={{ color: '#111' }}>{titulo}</p>
        {nota && <p className="text-xs mt-0.5" style={{ color: '#666' }}>{nota}</p>}
      </div>
    </div>
    {children}
  </div>
);

const Campo = ({ label, nota, sufijo, children }: {
  label: string; nota?: string; sufijo?: string; children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-xs font-bold block mb-1" style={{ color: '#333' }}>
      {label} {sufijo && <span style={{ color: '#999' }}>({sufijo})</span>}
    </span>
    {children}
    {nota && <span className="text-[0.68rem] block mt-1" style={{ color: '#888' }}>{nota}</span>}
  </label>
);

const Linea = ({ children, destacada }: { children: React.ReactNode; destacada?: boolean }) => (
  <li className="flex items-start gap-2">
    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
      style={{ background: destacada ? '#D4AF37' : 'rgba(255,255,255,0.35)' }} />
    <span style={destacada ? { color: '#fff', fontWeight: 800 } : { color: 'rgba(255,255,255,0.8)' }}>
      {children}
    </span>
  </li>
);
