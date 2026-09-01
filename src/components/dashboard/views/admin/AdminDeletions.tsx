import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserMinus, Trash2, Check, MessageSquare, Heart, Briefcase, Clock } from 'lucide-react';
import { ROLE_ES } from '@/lib/constants';
import { EXIT_REASON_LABELS } from '@/components/dashboard/ExitSurveyModal';

// Gestión de bajas: qué perfiles se han ido, qué hicieron mientras estuvieron y
// por qué dicen que se van.
//
// Los registros no llevan nombre ni email: quien se da de baja ejerce el derecho
// de supresión (RGPD Art. 17) y conservar su identidad sería incompatible. Lo
// que sí se guarda es su comportamiento en cifras, que es lo que responde la
// pregunta de negocio — si messages_received y bookings_received son 0, el
// problema no es el producto sino que no hay empresarios buscando.

export interface Deletion {
  id: string;
  deleted_at: string;
  role: string | null;
  zone: string | null;
  had_photo: boolean;
  had_bio: boolean;
  had_media: boolean;
  was_verified: boolean;
  hourly_rate: number | null;
  days_active: number | null;
  messages_sent: number;
  messages_received: number;
  conversations: number;
  bookings_received: number;
  bookings_created: number;
  favorited_by: number;
  favorites_made: number;
  reviews_received: number;
  profile_score: number | null;
  last_activity_at: string | null;
  exit_reason: string | null;
  exit_comment: string | null;
  acknowledged: boolean;
}

const roleLabel = (r: string | null) => (r ? ROLE_ES[r] ?? r : 'Sin rol');
const fecha = (d: string) =>
  new Date(d).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Lectura del caso en una frase. Con 7 camareros y 12 DJs, saber si el que se
// fue llegó a recibir algo o se fue "a oscuras" vale más que cualquier gráfica.
function diagnostico(d: Deletion): { texto: string; color: string } {
  const sinContacto = d.messages_received === 0 && d.bookings_received === 0;
  if (sinContacto && d.favorited_by === 0) {
    return { texto: 'Nadie le contactó ni le guardó en favoritos — falta de demanda', color: '#dc2626' };
  }
  if (sinContacto) {
    return { texto: `Le guardaron ${d.favorited_by} vez/veces pero nadie le escribió`, color: '#ea580c' };
  }
  if (d.bookings_received === 0) {
    return { texto: `Recibió ${d.messages_received} mensajes pero ningún booking`, color: '#ca8a04' };
  }
  return { texto: `Recibió ${d.bookings_received} booking(s) y aun así se fue`, color: '#7c3aed' };
}

const Stat = ({ icon: Icon, label, value, alert }: { icon: any; label: string; value: number | string; alert?: boolean }) => (
  <div className="px-2.5 py-2 rounded-lg" style={{ background: alert ? 'rgba(220,38,38,0.07)' : 'rgba(0,0,0,0.03)' }}>
    <div className="flex items-center gap-1 mb-0.5" style={{ color: alert ? '#dc2626' : '#666' }}>
      <Icon size={11} />
      <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-base font-black" style={{ color: alert ? '#dc2626' : '#111' }}>{value}</p>
  </div>
);

const AdminDeletions = () => {
  const [rows, setRows] = useState<Deletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () => {
    (supabase.from('profile_deletions' as any) as any)
      .select('*')
      .order('deleted_at', { ascending: false })
      .limit(200)
      .then(({ data }: { data: Deletion[] | null }) => {
        setRows(data ?? []);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const ack = async (id: string) => {
    await (supabase.from('profile_deletions' as any) as any).update({ acknowledged: true }).eq('id', id);
    setRows(rs => rs.map(r => (r.id === id ? { ...r, acknowledged: true } : r)));
  };

  // Borrar el registro elimina también el análisis de esa baja, así que se
  // confirma: "marcar como visto" es lo que se quiere el 99% de las veces.
  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este registro de baja? Perderás sus datos de comportamiento. Si solo quieres quitar el aviso, usa "Marcar como visto".')) return;
    await (supabase.from('profile_deletions' as any) as any).delete().eq('id', id);
    setRows(rs => rs.filter(r => r.id !== id));
  };

  if (loading) return <p className="text-xs text-muted-foreground">Cargando bajas…</p>;

  if (rows.length === 0) {
    return (
      <div className="p-8 rounded-2xl text-center" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
        <UserMinus size={22} className="mx-auto mb-2" style={{ color: '#999' }} />
        <p className="text-sm font-bold mb-1">Ninguna baja registrada</p>
        <p className="text-xs" style={{ color: '#666' }}>
          El registro empieza a contar desde que se aplicó la migración: las bajas anteriores no dejaron rastro.
        </p>
      </div>
    );
  }

  // Agregado de motivos — con pocos registros una tabla ordenada dice más que
  // un gráfico.
  const motivos = rows.reduce<Record<string, number>>((acc, r) => {
    if (r.exit_reason) acc[r.exit_reason] = (acc[r.exit_reason] ?? 0) + 1;
    return acc;
  }, {});
  const motivosOrden = Object.entries(motivos).sort((a, b) => b[1] - a[1]);
  const sinRespuesta = rows.filter(r => !r.exit_reason).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat icon={UserMinus} label="Bajas totales" value={rows.length} />
        <Stat icon={Clock} label="Sin revisar" value={rows.filter(r => !r.acknowledged).length} alert={rows.some(r => !r.acknowledged)} />
        <Stat icon={MessageSquare} label="Respondieron" value={rows.length - sinRespuesta} />
        <Stat
          icon={Briefcase}
          label="Se fueron sin contacto"
          value={rows.filter(r => r.messages_received === 0 && r.bookings_received === 0).length}
          alert
        />
      </div>

      {motivosOrden.length > 0 && (
        <div className="p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
          <p className="text-xs font-bold mb-2.5">Motivos declarados</p>
          <div className="space-y-1.5">
            {motivosOrden.map(([id, n]) => (
              <div key={id} className="flex items-center gap-2">
                <span className="text-xs flex-1">{EXIT_REASON_LABELS[id] ?? id}</span>
                <div className="h-1.5 rounded-full" style={{ width: `${(n / rows.length) * 100}%`, minWidth: 6, background: '#D4AF37' }} />
                <span className="text-xs font-bold w-6 text-right">{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rows.map(d => {
          const diag = diagnostico(d);
          const abierto = openId === d.id;
          return (
            <div
              key={d.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#fff',
                border: `1px solid ${d.acknowledged ? 'rgba(0,0,0,0.08)' : 'rgba(220,38,38,0.35)'}`,
              }}
            >
              <button
                onClick={() => setOpenId(abierto ? null : d.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{roleLabel(d.role)}</span>
                    <span className="text-xs" style={{ color: '#666' }}>· {d.zone || 'sin zona'}</span>
                    {!d.acknowledged && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-black" style={{ background: '#dc2626', color: '#fff' }}>
                        NUEVO
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: diag.color }}>{diag.texto}</p>
                </div>
                <span className="text-[11px] whitespace-nowrap" style={{ color: '#888' }}>{fecha(d.deleted_at)}</span>
              </button>

              {abierto && (
                <div className="px-4 pb-4 space-y-3 animate-[fadeIn_0.2s_ease]">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    <Stat icon={Clock} label="Días activo" value={d.days_active ?? '—'} />
                    <Stat icon={MessageSquare} label="Msg enviados" value={d.messages_sent} />
                    <Stat icon={MessageSquare} label="Msg recibidos" value={d.messages_received} alert={d.messages_received === 0} />
                    <Stat icon={Briefcase} label="Bookings recib." value={d.bookings_received} alert={d.bookings_received === 0} />
                    <Stat icon={Heart} label="Le guardaron" value={d.favorited_by} alert={d.favorited_by === 0} />
                    <Stat icon={Heart} label="Guardó a otros" value={d.favorites_made} />
                    <Stat icon={MessageSquare} label="Conversaciones" value={d.conversations} />
                    <Stat icon={Briefcase} label="Reseñas" value={d.reviews_received} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {[
                      ['Foto', d.had_photo],
                      ['Bio', d.had_bio],
                      ['Media', d.had_media],
                      ['Verificado', d.was_verified],
                    ].map(([label, ok]) => (
                      <span
                        key={label as string}
                        className="px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.04)',
                          color: ok ? '#15803d' : '#999',
                        }}
                      >
                        {ok ? '✓' : '✗'} {label as string}
                      </span>
                    ))}
                    {d.hourly_rate ? (
                      <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(0,0,0,0.04)', color: '#666' }}>
                        {d.hourly_rate}€/h
                      </span>
                    ) : null}
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#8A6D0F' }}>
                      Motivo declarado
                    </p>
                    {d.exit_reason ? (
                      <>
                        <p className="text-sm font-bold">{EXIT_REASON_LABELS[d.exit_reason] ?? d.exit_reason}</p>
                        {d.exit_comment && (
                          <p className="text-xs mt-1.5 italic" style={{ color: '#444' }}>"{d.exit_comment}"</p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs" style={{ color: '#888' }}>Se fue sin responder la encuesta.</p>
                    )}
                  </div>

                  {d.last_activity_at && (
                    <p className="text-[11px]" style={{ color: '#888' }}>
                      Última actividad registrada: {fecha(d.last_activity_at)}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {!d.acknowledged && (
                      <button
                        onClick={() => ack(d.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#15803d', border: '1px solid rgba(34,197,94,0.3)' }}
                      >
                        <Check size={12} /> Marcar como visto
                      </button>
                    )}
                    <button
                      onClick={() => remove(d.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)' }}
                    >
                      <Trash2 size={12} /> Eliminar registro
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDeletions;
