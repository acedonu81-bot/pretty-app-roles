import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, RefreshCw, X, CheckCheck } from 'lucide-react';

/**
 * "El espía": qué está fallando ahora mismo, todo en un sitio.
 *
 * Hasta ahora cada problema vivía por su cuenta y había que ir a buscarlo:
 * los crons en cron.job_run_details, los crashes en client_errors, los
 * perfiles invisibles en su vista... Si algo se rompía en silencio —como los
 * 4 crons caídos 4 meses, o el dashboard en blanco del 4 sep— nadie se
 * enteraba hasta que el daño estaba hecho.
 *
 * Si esta pantalla sale vacía, el sistema está sano. Eso es justo lo que hace
 * que valga la pena mirarla.
 */

interface Alerta {
  tipo: string;
  severidad: 'critico' | 'alto' | 'medio';
  asunto: string;
  detalle: string;
  cuando: string | null;
  clave: string;
}

const ESTILO = {
  critico: { icon: AlertOctagon,  color: '#dc2626', fondo: 'rgba(220,38,38,0.08)',  borde: 'rgba(220,38,38,0.3)',  label: 'Crítico' },
  alto:    { icon: AlertTriangle, color: '#c2410c', fondo: 'rgba(194,65,12,0.08)',  borde: 'rgba(194,65,12,0.28)', label: 'Urgente' },
  medio:   { icon: Info,          color: '#a16207', fondo: 'rgba(161,98,7,0.07)',   borde: 'rgba(161,98,7,0.22)',  label: 'Revisar' },
} as const;

const TITULO: Record<string, string> = {
  cron_parado:             'Tarea automática parada',
  cron_fallido:            'Tarea automática con error',
  crash_cliente:           'Pantalla rota para un usuario',
  solicitud_sin_responder: 'Cliente esperando respuesta',
  perfil_invisible:        'No aparece en el directorio',
  alta_sin_volver:         'Se registró y no volvió',
};

const AdminSaludSistema = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [verTodo, setVerTodo] = useState(false);
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  const cargar = async () => {
    setCargando(true);
    const { data } = await (supabase.from('admin_salud_sistema' as any) as any).select('*').limit(200);
    setAlertas((data as Alerta[]) ?? []);
    setCargando(false);
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [instanceId]);

  // Descartar = "esto ya lo sé, no me lo vuelvas a enseñar". Sin esto el panel
  // acumula lo mismo para siempre, se convierte en ruido y se deja de mirar —
  // que es justo lo contrario de para lo que sirve.
  const descartar = async (claves: string[]) => {
    if (claves.length === 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    await (supabase.from('admin_alertas_descartadas' as any) as any).upsert(
      claves.map(clave => ({ clave, descartada_por: user?.id ?? null })),
      { onConflict: 'clave' },
    );
    setAlertas(prev => prev.filter(a => !claves.includes(a.clave)));
  };

  const criticas = alertas.filter(a => a.severidad === 'critico');
  const urgentes = alertas.filter(a => a.severidad === 'alto');
  const revisar  = alertas.filter(a => a.severidad === 'medio');

  // Lo grave siempre entero; lo de "revisar" se recorta para que la pantalla
  // no se convierta en un muro que se deja de mirar.
  const visibles = verTodo ? alertas : [...criticas, ...urgentes, ...revisar.slice(0, 5)];
  const ocultas = alertas.length - visibles.length;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-lg font-extrabold">Salud del sistema</h3>
          <p className="text-xs text-muted-foreground">
            Todo lo que está fallando ahora mismo. Si está vacío, va bien.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {alertas.length > 0 && (
            <button
              onClick={() => descartar(alertas.map(a => a.clave))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-opacity hover:opacity-70"
              style={{ borderColor: 'rgba(0,0,0,0.12)', color: '#666' }}
              title="Marca todo lo de ahora como visto. Lo que entre nuevo sí volverá a aparecer."
            >
              <CheckCheck size={12} /> Limpiar todo
            </button>
          )}
          <button
            onClick={cargar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-opacity hover:opacity-70"
            style={{ borderColor: 'rgba(0,0,0,0.12)' }}
          >
            <RefreshCw size={12} className={cargando ? 'animate-spin' : undefined} /> Comprobar
          </button>
        </div>
      </div>

      {/* Resumen de un vistazo */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {([['critico', criticas.length], ['alto', urgentes.length], ['medio', revisar.length]] as const).map(([sev, n]) => {
          const e = ESTILO[sev];
          return (
            <div key={sev} className="rounded-xl px-3 py-2.5"
              style={{ background: n > 0 ? e.fondo : 'rgba(0,0,0,0.02)', border: `1px solid ${n > 0 ? e.borde : 'transparent'}` }}>
              <p className="text-[0.65rem] font-black uppercase tracking-wider"
                style={{ color: n > 0 ? e.color : '#999' }}>{e.label}</p>
              <p className="text-xl font-black" style={{ color: n > 0 ? e.color : '#bbb' }}>{n}</p>
            </div>
          );
        })}
      </div>

      {alertas.length === 0 ? (
        <div className="px-4 py-10 text-center rounded-xl" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <ShieldCheck size={26} className="mx-auto mb-2" style={{ color: '#16a34a' }} />
          <p className="text-sm font-bold" style={{ color: '#15803d' }}>
            {cargando ? 'Comprobando…' : 'Todo en orden. Nada que revisar.'}
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-1.5">
            {visibles.map((a, i) => {
              const e = ESTILO[a.severidad] ?? ESTILO.medio;
              const Icon = e.icon;
              return (
                <li key={`${a.tipo}-${a.asunto}-${i}`}
                  className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                  style={{ background: e.fondo, border: `1px solid ${e.borde}` }}>
                  <span className="flex-shrink-0 mt-0.5" style={{ color: e.color }}>
                    <Icon size={16} strokeWidth={2.5} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: e.color }}>
                      {TITULO[a.tipo] ?? a.tipo}
                    </p>
                    <p className="text-sm font-bold mt-0.5 break-words">{a.asunto}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#666' }}>{a.detalle}</p>
                  </div>
                  <button
                    onClick={() => descartar([a.clave])}
                    aria-label="Descartar este aviso"
                    title="Ya lo sé — no volver a mostrarlo"
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-opacity opacity-40 hover:opacity-100"
                    style={{ color: e.color }}
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </li>
              );
            })}
          </ul>
          {ocultas > 0 && !verTodo && (
            <button onClick={() => setVerTodo(true)}
              className="mt-3 text-xs font-bold underline" style={{ color: '#8A6D0F' }}>
              Ver {ocultas} más
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AdminSaludSistema;
