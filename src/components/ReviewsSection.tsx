import { useState, useEffect } from 'react';
import { Star, Send, Flag, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { canSubmitReview, YesNoToggle } from '@/components/ReviewQuestions';

// Reseñas de un profesional: lista, reporte y formulario para quien le
// contrató. Vivía dentro de PublicProfile.tsx; se usa también en la ficha
// del panel (ProfessionalProfilePage) para que la valoración de las
// tarjetas del directorio lleve a leer las reseñas.

/* ── Reviews ─────────────────────────────────────────────────────────────── */
interface Review {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  event_type: string | null;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
  llego_puntual: boolean | null;
  cumplio_acordado: boolean | null;
  volveria_contratar: boolean | null;
}

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" onClick={() => onChange?.(n)}
        className={onChange ? 'cursor-pointer' : 'cursor-default'}
        style={{ background: 'none', border: 'none', padding: 0 }}>
        <Star size={onChange ? 28 : 14}
          fill={n <= value ? '#D4AF37' : 'none'}
          stroke={n <= value ? '#D4AF37' : 'rgba(22,20,18,0.2)'}
          strokeWidth={1.5} />
      </button>
    ))}
  </div>
);

const EVENT_TYPES = ['Boda','Comunión','Evento corporativo','Fiesta privada','Festival','Cumpleaños','Inauguración','Otro'];

export const ReviewsSection = ({ professionalUserId, professionalName, googleReviewUrl }: { professionalUserId: string; professionalName: string; googleReviewUrl: string | null }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Tras dejar la reseña en XPEAK, se ofrece el mismo gesto para Google si el
  // profesional tiene ficha configurada. No existe API para publicar una
  // reseña de XPEAK en Google Business Profile de forma automática — esto es
  // un enlace directo al formulario de Google, no una sincronización.
  const [justSubmitted, setJustSubmitted] = useState(false);
  // Rol/nombre ya no se piden a mano — vienen de un booking completado real,
  // verificado server-side (RLS exige flash_bookings.status='completed' con
  // este usuario y este profesional). Sin esto, cualquier visitante anónimo
  // podía dejar una valoración sin haber contratado nunca.
  const [eligibleBooking, setEligibleBooking] = useState<{ requester_name: string } | null | 'loading'>('loading');
  const [form, setForm] = useState({ event_type: '', rating: 5, comment: '' });
  // Solo tiene sentido en este sentido (organizador valora a un profesional):
  // es quien llega a un sitio y cumple un servicio acordado. Antes se pedían
  // aparte, como un paso de "completar" en HistorialTab.tsx que casi nadie
  // usaba — integradas aquí para que no quede ninguna reseña a medias
  // (reportado por el usuario el 3 oct 2026, su propia reseña había quedado
  // incompleta sin estas 3 respuestas).
  const [llegoPuntual, setLlegoPuntual] = useState<boolean | null>(null);
  const [cumplioAcordado, setCumplioAcordado] = useState<boolean | null>(null);
  const [volveriaContratar, setVolveriaContratar] = useState<boolean | null>(null);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportedReviewIds, setReportedReviewIds] = useState<Set<string>>(new Set());

  const reportReview = async (reviewId: string, reason: string) => {
    if (!user) return;
    const { error } = await supabase.from('content_reports').insert({
      reporter_id: user.id,
      content_type: 'review',
      content_id: reviewId,
      reason,
    });
    if (error) {
      if (error.code === '23505') { toast.error('Ya reportaste esta reseña.'); }
      else toast.error('No se pudo enviar el reporte');
      return;
    }
    toast.success('Reporte enviado. Un administrador lo revisará.');
    setReportedReviewIds(prev => new Set(prev).add(reviewId));
  };

  useEffect(() => {
    if (!professionalUserId) return;
    supabase
      .from('reviews')
      .select('id, reviewer_name, reviewer_role, event_type, rating, comment, created_at, approved, llego_puntual, cumplio_acordado, volveria_contratar')
      .eq('reviewed_user_id', professionalUserId)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews((data ?? []) as Review[]));
  }, [professionalUserId]);

  useEffect(() => {
    if (!professionalUserId || !user) { setEligibleBooking(null); return; }
    let cancelled = false;
    (async () => {
      const { data: flashBooking } = await supabase
        .from('flash_bookings')
        .select('requester_name')
        .eq('created_by', user.id)
        .eq('professional_user_id', professionalUserId)
        .in('status', ['confirmed', 'accepted', 'completed'])
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (flashBooking) { setEligibleBooking(flashBooking); return; }

      // Segunda vía de contratación (13 sep 2026): event_requests /
      // event_request_responses. El botón "Valorar" solo miraba
      // flash_bookings, así que un organizador que contrató por esta vía
      // (caso real: Burger Gourmet Fest → Gonzalo DJ, 11 sep) nunca veía el
      // formulario aunque el email le pidiera valorar — la contratación era
      // real pero invisible para esta comprobación.
      const { data: hiredResponse } = await supabase
        .from('event_request_responses' as any)
        .select('id, event_requests!inner(client_user_id, client_name)')
        .not('hired_at', 'is', null)
        .eq('professional_user_id', professionalUserId)
        .eq('event_requests.client_user_id', user.id)
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      const requesterName = (hiredResponse as any)?.event_requests?.client_name;
      setEligibleBooking(requesterName ? { requester_name: requesterName } : null);
    })();
    return () => { cancelled = true; };
  }, [professionalUserId, user]);

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eligibleBooking || eligibleBooking === 'loading') return;
    if (!canSubmitReview(form.rating, form.comment, llegoPuntual, cumplioAcordado, volveriaContratar)) {
      if (form.comment.trim().length < 5) { toast.error('Escribe un comentario breve (mín. 5 caracteres).'); return; }
      toast.error('Responde las 3 preguntas antes de enviar tu valoración.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      reviewer_id: user.id,
      reviewed_user_id: professionalUserId,
      reviewer_name: eligibleBooking.requester_name,
      reviewer_role: 'Organizador',
      event_type: form.event_type || null,
      rating: form.rating,
      comment: form.comment.trim(),
      llego_puntual: llegoPuntual,
      cumplio_acordado: cumplioAcordado,
      volveria_contratar: volveriaContratar,
      approved: false,
    } as any);
    setSubmitting(false);
    if (error) { toast.error('Error al enviar. Inténtalo de nuevo.'); return; }
    toast.success('¡Gracias! Tu valoración se publicará tras revisión.');
    // Sin este aviso, la reseña queda pendiente en Supabase sin que nadie se
    // entere — la moderación dependía de entrar manualmente al Panel Admin.
    supabase.functions.invoke('send-email', {
      body: {
        type: 'new_review_pending',
        data: {
          professionalName,
          reviewerName: eligibleBooking.requester_name,
          reviewerRole: 'Organizador',
          eventType: form.event_type || null,
          rating: form.rating,
          comment: form.comment.trim(),
        },
      },
    }).catch((err: unknown) => console.warn('[email] new_review_pending failed:', err));
    setShowForm(false);
    setForm({ event_type: '', rating: 5, comment: '' });
    setLlegoPuntual(null);
    setCumplioAcordado(null);
    setVolveriaContratar(null);
    setJustSubmitted(true);
  };

  const questionStats = reviewQuestionStats(reviews);

  // Sin reseñas y sin nadie que pueda dejar una ahora mismo (visitante
  // anónimo o sin booking elegible): no hay nada que mostrar ni que hacer
  // aquí, así que la sección entera se oculta en vez de exponer el hueco
  // vacío ("sé el primero en valorar" resta confianza más de lo que suma).
  const hasNothingToShow = reviews.length === 0 && !(eligibleBooking && eligibleBooking !== 'loading');
  if (hasNothingToShow) return null;

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-black" style={{ color: '#222', fontFamily: 'Syne, sans-serif' }}>
            Valoraciones
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={14} fill="#D4AF37" stroke="#D4AF37" />
              <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>{avgRating.toFixed(1)}</span>
              <span className="text-xs" style={{ color: '#444' }}>({reviews.length})</span>
            </div>
          )}
        </div>
        {eligibleBooking && eligibleBooking !== 'loading' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#B8941E', border: '1px solid rgba(212,175,55,0.25)' }}>
            <Star size={11} /> Dejar valoración
          </button>
        )}
      </div>

      {justSubmitted && googleReviewUrl && (
        <div className="flex items-center justify-between gap-3 mb-4 p-3 rounded-xl"
          style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-xs" style={{ color: '#444' }}>
            ¿Le dejas también unas líneas en Google? Ayuda mucho a {professionalName}.
          </p>
          <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => setJustSubmitted(false)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            También en Google
          </a>
        </div>
      )}

      {/* Solo puede valorar quien contrató de verdad (booking completado con
          este profesional) — evita reseñas falsas de gente que nunca contrató.
          Este aviso solo tiene sentido cuando SÍ hay algo que valorar/ver: con
          0 reseñas, mostrar "solo puede valorar quien..." + "sé el primero"
          juntos subraya la falta de tracción en vez de ocultarla. */}
      {reviews.length > 0 && !user && (
        <p className="text-xs mb-3" style={{ color: '#666' }}>
          Solo pueden valorar organizadores que hayan completado un booking con {professionalName}.
        </p>
      )}
      {reviews.length > 0 && user && eligibleBooking === null && (
        <p className="text-xs mb-3" style={{ color: '#666' }}>
          Solo pueden valorar organizadores que hayan completado un booking con {professionalName}.
        </p>
      )}

      {reviews.length > 0 && questionStats.length > 0 && (
        <p className="text-xs mb-3" style={{ color: '#666' }}>
          {questionStats.map((s) => `${s.percent}% ${s.label}`).join(' · ')}
        </p>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? null : (
        <div className="flex flex-col gap-3">
          {reviews.map(r => (
            <div key={r.id} className="p-4 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#222' }}>{r.reviewer_name}</p>
                  <p className="text-xs" style={{ color: '#444' }}>
                    {r.reviewer_role}{r.event_type ? ` · ${r.event_type}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating value={r.rating} />
                  <span className="text-[10px]" style={{ color: '#444' }}>
                    {new Date(r.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#333' }}>"{r.comment}"</p>
              {user && (
                <button
                  onClick={() => setReportingReviewId(r.id)}
                  disabled={reportedReviewIds.has(r.id)}
                  className="mt-2 flex items-center gap-1 text-[11px] font-medium disabled:opacity-50"
                  style={{ color: '#888' }}>
                  <Flag size={10} /> {reportedReviewIds.has(r.id) ? 'Reportada' : 'Reportar'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report review modal */}
      <AnimatePresence>
        {reportingReviewId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setReportingReviewId(null)}>
            <div className="w-full max-w-sm rounded-2xl p-5" style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
              <p className="text-sm font-bold mb-1" style={{ color: '#111' }}>Reportar reseña</p>
              <p className="text-xs mb-3" style={{ color: '#555' }}>
                Un administrador de XPEAK la revisará.
              </p>
              <div className="flex flex-col gap-1.5">
                {['Contenido ofensivo o abusivo', 'Acoso o intimidación', 'Spam o estafa', 'Reseña falsa o no relacionada con un servicio real', 'Otro motivo'].map(reason => (
                  <button key={reason}
                    onClick={() => { reportReview(reportingReviewId, reason); setReportingReviewId(null); }}
                    className="text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-black/5"
                    style={{ background: 'rgba(0,0,0,0.03)', color: '#222' }}>
                    {reason}
                  </button>
                ))}
              </div>
              <button onClick={() => setReportingReviewId(null)}
                className="w-full mt-3 px-3.5 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-md rounded-3xl p-6"
              style={{ background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-black text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Valorar a {professionalName}
                </h4>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-black/5">
                  <X size={16} style={{ color: '#333' }} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Rating */}
                <div>
                  <label className="text-xs font-bold mb-2 block" style={{ color: '#333' }}>PUNTUACIÓN *</label>
                  <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                </div>
                {/* Event type */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block" style={{ color: '#333' }}>TIPO DE EVENTO</label>
                  <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <option value="">Seleccionar...</option>
                    {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {/* Comment */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block" style={{ color: '#333' }}>TU VALORACIÓN *</label>
                  <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Cuéntanos tu experiencia..." required rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <YesNoToggle label="¿Llegó puntual al evento?" value={llegoPuntual} onChange={setLlegoPuntual} />
                <YesNoToggle label="¿Cumplió con lo acordado?" value={cumplioAcordado} onChange={setCumplioAcordado} />
                <YesNoToggle label="¿Volverías a contratarlo/a?" value={volveriaContratar} onChange={setVolveriaContratar} />
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', opacity: submitting ? 0.7 : 1 }}>
                  <Send size={14} /> {submitting ? 'Enviando...' : 'Enviar valoración'}
                </button>
                <p className="text-[10px] text-center" style={{ color: '#444' }}>
                  Las valoraciones se publican tras revisión en 24h.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function reviewQuestionStats(
  reviews: { llego_puntual: boolean | null; cumplio_acordado: boolean | null; volveria_contratar: boolean | null }[],
): { label: string; percent: number }[] {
  const questions: { key: 'llego_puntual' | 'cumplio_acordado' | 'volveria_contratar'; label: string }[] = [
    { key: 'llego_puntual', label: 'dice que llegó puntual' },
    { key: 'cumplio_acordado', label: 'cumplió lo acordado' },
    { key: 'volveria_contratar', label: 'repetiría' },
  ];

  const stats: { label: string; percent: number }[] = [];
  for (const q of questions) {
    const answered = reviews.filter((r) => r[q.key] !== null);
    if (answered.length === 0) continue;
    const yes = answered.filter((r) => r[q.key] === true).length;
    stats.push({ label: q.label, percent: Math.round((yes / answered.length) * 100) });
  }
  return stats;
}

export default ReviewsSection;
