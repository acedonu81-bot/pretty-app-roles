import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, ChevronDown, Star, MessageCircle, Info } from 'lucide-react';

// Banner de contratos completados (13 sep 2026): quién contrató a quién y
// qué día, juntando las dos vías reales de contratación —
// flash_bookings (confirmed/completed) y event_request_responses
// (hired_at no nulo) — porque son caras del mismo hecho de negocio y antes
// solo se veían por separado como conteos sueltos en AdminMetrics, sin
// nombres ni fechas.
//
// Ampliado el 13 sep 2026 para desplegarse por fila: al hacer clic se ve si
// hubo reseña, si hablaron por chat (sin leer el contenido — privacidad del
// chat entre usuarios) y el detalle propio de cada vía. Fetch bajo demanda
// solo al expandir: con 30+30 contratos cargarlo todo de golpe no aporta
// nada si el admin solo mira 2 o 3.

interface HiredContract {
  id: string;
  source: 'flash' | 'request';
  organizador: string;
  organizadorId: string | null;
  profesional: string;
  profesionalId: string | null;
  fecha: string; // fecha del contrato (hired_at / created_at), no del evento
  // true cuando quien crea la solicitud y el profesional son el mismo usuario:
  // el profesional apuntando un bolo que ya tenía cerrado por fuera (caso real
  // 15 sep 2026: Dj Poly registrando "edu / 150€ / 19-sep"). No es un contrato
  // entre dos partes, así que no suma en el contador ni se le mira chat/reseña.
  autoRegistro: boolean;
  detalle: Record<string, unknown>;
}

interface ReviewInfo { rating: number; comment: string | null; approved: boolean }
interface ContractDetail {
  // Un contrato puede tener reseña en cada dirección de forma independiente
  // (organizador→profesional y profesional→organizador) — antes solo se
  // consultaba una, así que un contrato con solo la reseña inversa (caso
  // real: Gonzalo DJ valoró a Burger Gourmet, no al revés) mostraba "sin
  // reseña todavía" aunque sí hubiera una.
  reviewOrganizadorAProfesional: ReviewInfo | null;
  reviewProfesionalAOrganizador: ReviewInfo | null;
  chat: { hablaron: boolean; numMensajes: number; ultimoMensaje: string | null };
}

const AdminHiredContracts = () => {
  const [contracts, setContracts] = useState<HiredContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, ContractDetail | 'loading'>>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [{ data: flash }, { data: requests }] = await Promise.all([
        supabase
          .from('flash_bookings')
          .select('id, requester_name, professional_name, created_at, created_by, professional_user_id, status, agreed_price, event_date, event_location, es_autorregistro')
          .in('status', ['confirmed', 'accepted', 'completed'])
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('event_request_responses' as any)
          .select('id, hired_at, professional_user_id, message, status, chosen_at, review_asked_at, event_requests!inner(client_name, client_user_id)')
          .not('hired_at', 'is', null)
          .order('hired_at', { ascending: false })
          .limit(30),
      ]);

      if (cancelled) return;

      const flashRows: HiredContract[] = (flash ?? []).map((b: any) => ({
        id: b.id,
        source: 'flash',
        organizador: b.requester_name || 'Organizador',
        organizadorId: b.created_by ?? null,
        profesional: b.professional_name || 'Profesional',
        profesionalId: b.professional_user_id ?? null,
        fecha: b.created_at,
        autoRegistro: b.es_autorregistro === true,
        detalle: { status: b.status, agreed_price: b.agreed_price, event_date: b.event_date, event_location: b.event_location },
      }));

      // El nombre del profesional no está en event_request_responses, solo el
      // user_id — se resuelve aparte contra profiles en vez de un join directo
      // (PostgREST no permite !inner cruzado con una tabla no relacionada por FK
      // declarada en el mismo sentido).
      const reqRows = requests ?? [];
      const profIds = [...new Set(reqRows.map((r: any) => r.professional_user_id).filter(Boolean))];
      let nameMap = new Map<string, string>();
      if (profIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', profIds);
        nameMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p.display_name]));
      }

      const requestRows: HiredContract[] = reqRows.map((r: any) => ({
        id: r.id,
        source: 'request',
        organizador: r.event_requests?.client_name || 'Organizador',
        organizadorId: r.event_requests?.client_user_id ?? null,
        profesional: nameMap.get(r.professional_user_id) || 'Profesional',
        profesionalId: r.professional_user_id ?? null,
        fecha: r.hired_at,
        // Esta via siempre tiene cliente y profesional distintos.
        autoRegistro: false,
        detalle: { status: r.status, message: r.message, chosen_at: r.chosen_at, review_asked_at: r.review_asked_at },
      }));

      const all = [...flashRows, ...requestRows].sort((a, b) => b.fecha.localeCompare(a.fecha));
      setContracts(all);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const toggle = async (c: HiredContract) => {
    const key = `${c.source}_${c.id}`;
    if (expandedId === key) { setExpandedId(null); return; }
    setExpandedId(key);
    // Sin caché: el estado (reseñas, chat) cambia con el tiempo, así que se
    // recarga cada vez que se expande en vez de quedarse con el primer
    // resultado para siempre.
    setDetails(prev => ({ ...prev, [key]: 'loading' }));

    if (!c.organizadorId || !c.profesionalId) {
      setDetails(prev => ({ ...prev, [key]: { reviewOrganizadorAProfesional: null, reviewProfesionalAOrganizador: null, chat: { hablaron: false, numMensajes: 0, ultimoMensaje: null } } }));
      return;
    }

    // conversations/messages tienen RLS "solo participantes" — el admin no lo
    // es, así que leerlas directo siempre daría 0 filas. panel_admin_contrato_chat
    // es un RPC SECURITY DEFINER que comprueba es_admin() y solo expone el
    // hecho (sí/no, cuántos, cuándo), nunca el contenido del chat.
    const [{ data: rowsOrgAProf }, { data: rowsProfAOrg }, { data: chatRows }] = await Promise.all([
      supabase
        .from('reviews')
        .select('rating, comment, approved')
        .eq('reviewer_id', c.organizadorId)
        .eq('reviewed_user_id', c.profesionalId)
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('reviews')
        .select('rating, comment, approved')
        .eq('reviewer_id', c.profesionalId)
        .eq('reviewed_user_id', c.organizadorId)
        .order('created_at', { ascending: false })
        .limit(1),
      (supabase.rpc as any)('panel_admin_contrato_chat', { p_user_a: c.organizadorId, p_user_b: c.profesionalId }),
    ]);

    const chat = chatRows?.[0];
    const toReview = (rows: typeof rowsOrgAProf) => rows?.[0] ? { rating: rows[0].rating, comment: rows[0].comment, approved: rows[0].approved } : null;

    setDetails(prev => ({
      ...prev,
      [key]: {
        reviewOrganizadorAProfesional: toReview(rowsOrgAProf),
        reviewProfesionalAOrganizador: toReview(rowsProfAOrg),
        chat: {
          hablaron: chat?.hablaron ?? false,
          numMensajes: chat?.num_mensajes ?? 0,
          ultimoMensaje: chat?.ultimo_mensaje ?? null,
        },
      },
    }));
  };

  if (loading) return null;
  if (contracts.length === 0) return null;

  const fmtFecha = (iso: string | null) => iso
    ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  // El contador solo cuenta contratos entre dos partes distintas. Los
  // autorregistros siguen listados (son historial real del profesional),
  // pero aparte y sin sumar, para no leer como demanda que no existio.
  const realCount = contracts.filter(c => !c.autoRegistro).length;
  const autoCount = contracts.length - realCount;

  const AUTO_TOOLTIP = 'El profesional se registró él mismo este bolo: quien lo creó y el profesional contratado son la misma cuenta. Suele ser un trabajo ya cerrado por fuera que apunta para tener historial. Es legítimo, pero no cuenta como contratación conseguida en XPEAK y no suma en las métricas.';

  return (
    <div className="glass-panel p-5 mb-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
        Contratos Completados
        <span className="text-[0.75rem] px-2 py-0.5 rounded-full font-bold"
          style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
          {realCount}
        </span>
        {autoCount > 0 && (
          <span title={AUTO_TOOLTIP}
            className="text-[0.7rem] px-2 py-0.5 rounded-full font-bold cursor-help"
            style={{ background: 'rgba(148,163,184,0.16)', color: '#64748b' }}>
            +{autoCount} autorregistro{autoCount > 1 ? 's' : ''}
          </span>
        )}
      </h3>
      <div className="space-y-2 max-h-[32rem] overflow-y-auto">
        {contracts.map(c => {
          const key = `${c.source}_${c.id}`;
          const isOpen = expandedId === key;
          const detail = details[key];
          return (
            <div key={key} className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <button onClick={() => toggle(c)}
                className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-black/[0.02]">
                <p className="text-sm flex items-center gap-2 flex-wrap" style={{ color: '#222' }}>
                  <span>
                    <span className="font-bold">{c.organizador}</span>
                    <span style={{ color: '#888' }}> → </span>
                    <span className="font-bold">{c.profesional}</span>
                  </span>
                  {c.autoRegistro && (
                    <span title={AUTO_TOOLTIP}
                      className="text-[0.65rem] px-1.5 py-0.5 rounded-full font-bold cursor-help"
                      style={{ background: 'rgba(148,163,184,0.16)', color: '#64748b' }}>
                      Autorregistro
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-xs" style={{ color: '#888' }}>{fmtFecha(c.fecha)}</p>
                  <ChevronDown size={14} style={{ color: '#999', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 text-xs space-y-2.5" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 10 }}>
                  {detail === 'loading' || !detail ? (
                    <p style={{ color: '#999' }}>Cargando…</p>
                  ) : (
                    <>
                      <div>
                        <p className="font-bold mb-1" style={{ color: '#555' }}>Contrato</p>
                        {c.source === 'flash' ? (
                          <p style={{ color: '#444' }}>
                            Estado: {String(c.detalle.status)}
                            {c.detalle.agreed_price ? ` · Precio: ${c.detalle.agreed_price}€` : ''}
                            {c.detalle.event_date ? ` · Evento: ${c.detalle.event_date}` : ''}
                            {c.detalle.event_location ? ` (${c.detalle.event_location})` : ''}
                          </p>
                        ) : (
                          <p style={{ color: '#444' }}>
                            Estado: {String(c.detalle.status)}
                            {c.detalle.review_asked_at ? ' · Reseña ya solicitada' : ' · Reseña no solicitada aún'}
                          </p>
                        )}
                      </div>

                      {c.autoRegistro ? (
                        // Sin dos partes distintas, "no ha valorado" y "nunca
                        // se escribieron por chat" no significan nada: no hay
                        // con quien hablar ni a quien valorar. Se explica en
                        // su lugar por que este contrato no suma.
                        <div className="flex items-start gap-1.5 rounded-lg p-2"
                          style={{ background: 'rgba(148,163,184,0.10)' }}>
                          <Info size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#64748b' }} />
                          <p style={{ color: '#475569' }}>
                            <span className="font-bold">Registro propio, no cuenta como contrato.</span>{' '}
                            {c.profesional} creó esta solicitud desde su propia cuenta, así que no hay
                            segunda parte: ni chat ni reseñas entre dos personas. Suele ser un bolo
                            ya cerrado por fuera que se apunta para tener historial. No suma en las métricas.
                          </p>
                        </div>
                      ) : (
                      <>
                      <div className="flex items-start gap-1.5">
                        <Star size={12} className="mt-0.5" style={{ color: detail.reviewOrganizadorAProfesional ? '#D4AF37' : '#ccc' }} />
                        {detail.reviewOrganizadorAProfesional ? (
                          <p style={{ color: '#444' }}>
                            {c.organizador} → {c.profesional}: {detail.reviewOrganizadorAProfesional.rating}/5
                            {detail.reviewOrganizadorAProfesional.approved ? '' : ' (pendiente de aprobar)'}
                            {detail.reviewOrganizadorAProfesional.comment ? ` · "${detail.reviewOrganizadorAProfesional.comment}"` : ''}
                          </p>
                        ) : (
                          <p style={{ color: '#999' }}>{c.organizador} no ha valorado a {c.profesional} todavía</p>
                        )}
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Star size={12} className="mt-0.5" style={{ color: detail.reviewProfesionalAOrganizador ? '#D4AF37' : '#ccc' }} />
                        {detail.reviewProfesionalAOrganizador ? (
                          <p style={{ color: '#444' }}>
                            {c.profesional} → {c.organizador}: {detail.reviewProfesionalAOrganizador.rating}/5
                            {detail.reviewProfesionalAOrganizador.approved ? '' : ' (pendiente de aprobar)'}
                            {detail.reviewProfesionalAOrganizador.comment ? ` · "${detail.reviewProfesionalAOrganizador.comment}"` : ''}
                          </p>
                        ) : (
                          <p style={{ color: '#999' }}>{c.profesional} no ha valorado a {c.organizador} todavía</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MessageCircle size={12} style={{ color: detail.chat.hablaron ? '#2563EB' : '#ccc' }} />
                        {detail.chat.hablaron ? (
                          <p style={{ color: '#444' }}>
                            Hablaron por chat ({detail.chat.numMensajes} mensajes, último {fmtFecha(detail.chat.ultimoMensaje)})
                          </p>
                        ) : (
                          <p style={{ color: '#999' }}>Nunca se escribieron por chat</p>
                        )}
                      </div>
                      </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHiredContracts;
