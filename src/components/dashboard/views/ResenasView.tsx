import { useState, useEffect, useCallback } from 'react';
import { Star, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { fetchPendingReviewTargets } from '@/hooks/usePendingReviewsCount';
import { ReviewModal, type Booking } from '@/components/dashboard/views/empresario/HistorialTab';

interface Recibida {
  id: string;
  rating: number;
  comment: string | null;
  event_type: string | null;
  created_at: string | null;
  reviewer_name: string | null;
  reviewer_role: string | null;
  approved: boolean;
  rejected_at: string | null;
}

const fecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const Estrellas = ({ valor }: { valor: number }) => (
  <span className="inline-flex gap-0.5" aria-label={`${valor} de 5`}>
    {[1, 2, 3, 4, 5].map(n => (
      <Star key={n} size={12} fill={n <= valor ? '#D4AF37' : 'none'} style={{ color: n <= valor ? '#D4AF37' : 'rgba(0,0,0,0.2)' }} />
    ))}
  </span>
);

// Pantalla "Reseñas" (19 oct 2026). Antes el botón de la barra lateral era un
// atajo a Flash Booking → Solicitudes / Empresario → Historial: con nada
// pendiente aterrizabas ahí sin ver ninguna reseña. Ahora junta las dos cosas
// que la gente viene a hacer: valorar a quien ha trabajado con ella y ver lo
// que dicen de ella.
const ResenasView = () => {
  const { user } = useAuth();
  const { role } = useProfile();
  const [cargando, setCargando] = useState(true);
  const [pendientes, setPendientes] = useState<Booking[]>([]);
  const [recibidas, setRecibidas] = useState<Recibida[]>([]);
  const [valorando, setValorando] = useState<Booking | null>(null);

  const cargar = useCallback(async () => {
    if (!user) { setCargando(false); return; }
    setCargando(true);
    const [ids, { data: recib }] = await Promise.all([
      fetchPendingReviewTargets(user.id, role),
      supabase
        .from('reviews')
        .select('id, rating, comment, event_type, created_at, reviewer_name, reviewer_role, approved, rejected_at')
        .eq('reviewed_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    let nombres = new Map<string, { display_name: string | null; role: string | null }>();
    if (ids.length > 0) {
      const { data: perfiles } = await supabase.from('profiles').select('user_id, display_name, role').in('user_id', ids);
      nombres = new Map((perfiles ?? []).map((p: any) => [p.user_id, { display_name: p.display_name, role: p.role }]));
    }
    setPendientes(ids.map(id => ({
      id,
      professional_name: nombres.get(id)?.display_name || 'Usuario de XPEAK',
      professional_role: nombres.get(id)?.role ?? null,
      professional_user_id: id,
      event_date: null,
      event_location: null,
      event_description: null,
      agreed_price: null,
      status: 'completed',
      created_at: null,
    })));
    setRecibidas(((recib ?? []) as Recibida[]).filter(r => !r.rejected_at));
    setCargando(false);
  }, [user, role]);

  useEffect(() => { cargar(); }, [cargar]);

  const publicadas = recibidas.filter(r => r.approved);
  const media = publicadas.length ? publicadas.reduce((s, r) => s + r.rating, 0) / publicadas.length : 0;

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold mb-0.5">Mis <span className="text-gradient">reseñas</span></h2>
      <p className="text-xs mb-4" style={{ color: 'rgba(0,0,0,0.6)' }}>
        Valora a quien ha trabajado contigo y mira lo que dicen de ti.
      </p>

      {/* Pendientes de valorar */}
      <section className="mb-5" aria-labelledby="resenas-pendientes">
        <div className="flex items-center gap-2 mb-2">
          <h3 id="resenas-pendientes" className="text-sm font-black">Pendientes de valorar</h3>
          {pendientes.length > 0 && (
            <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.18)', color: '#7a6216' }}>
              {pendientes.length}
            </span>
          )}
        </div>
        {cargando ? (
          <div className="glass-panel px-3 py-2.5 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>Cargando…</div>
        ) : pendientes.length === 0 ? (
          <div className="glass-panel px-3 py-2.5">
            <p className="text-xs font-bold">No tienes valoraciones pendientes</p>
            <p className="text-[0.75rem] mt-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Cuando cierres un trato con alguien podrás valorarlo desde aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {pendientes.map(p => (
              <div key={p.id} className="glass-panel px-3 py-2 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate">{p.professional_name}</p>
                  <p className="text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.55)' }}>Han trabajado juntos</p>
                </div>
                <button
                  type="button"
                  onClick={() => setValorando(p)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black animate-pulse motion-reduce:animate-none transition-transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#E9C866,#D4AF37)', color: '#111', border: '1px solid #B8941E' }}
                >
                  Valorar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lo que dicen de ti */}
      <section aria-labelledby="resenas-recibidas">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3 id="resenas-recibidas" className="text-sm font-black">Lo que dicen de ti</h3>
          {publicadas.length > 0 && (
            <span className="flex items-center gap-2 text-xs font-bold">
              <Estrellas valor={Math.round(media)} />
              <span>{media.toFixed(1)} · {publicadas.length} {publicadas.length === 1 ? 'reseña' : 'reseñas'}</span>
            </span>
          )}
        </div>
        {cargando ? null : recibidas.length === 0 ? (
          <div className="glass-panel px-3 py-2.5">
            <p className="text-xs font-bold">Todavía no te han dejado reseñas</p>
            <p className="text-[0.75rem] mt-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Cuando alguien te valore, aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recibidas.map(r => (
              <article key={r.id} className="glass-panel px-3 py-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Estrellas valor={r.rating} />
                  <span className="text-xs font-black">{r.reviewer_name || 'Usuario de XPEAK'}</span>
                  {!r.approved && (
                    <span className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.06)', color: '#555' }}>
                      <Clock size={10} /> En revisión
                    </span>
                  )}
                  <span className="ml-auto text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    {[r.event_type, fecha(r.created_at)].filter(Boolean).join(' · ')}
                  </span>
                </div>
                {r.comment && <p className="text-xs leading-snug mt-0.5 line-clamp-2" style={{ color: '#222' }}>{r.comment}</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      {valorando && (
        <ReviewModal
          booking={valorando}
          reviewerId={user?.id ?? ''}
          onClose={() => setValorando(null)}
          onDone={(targetId) => {
            setPendientes(prev => prev.filter(p => p.professional_user_id !== targetId));
            setValorando(null);
          }}
        />
      )}
    </div>
  );
};

export default ResenasView;
