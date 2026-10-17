import { useEffect, useState } from 'react';
import { Bell, Share2, Disc3, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { HZ, TONES, clay, clayButton } from '@/components/healthy-zone/clay';
import { enlacePedirVoto, mensajePedirVoto, emailValido, FUENTE_PROXIMA_EDICION } from '@/lib/concursoCaptacion';

/**
 * Captación a partir del Concurso DJ (17 oct 2026). La gente que entra solo a
 * votar se registra y se va; ninguno de los 13 votantes de los dos primeros días
 * había dado consentimiento de marketing, así que el email promocional no es
 * una vía. Estas tres piezas dejan una forma de volver a hablar con ellos:
 *  1. AvisoResultado: tras votar, un toque para recibir el resultado y los
 *     próximos concursos (consentimiento expreso, guardado en el perfil).
 *  2. PedirVoto: en la tarjeta del propio aspirante, enlace con su ?ref= y un
 *     mensaje listo para compartir; el panel cuenta las altas que trae.
 *  3. ProximaEdicionDJ: "¿Eres DJ? Avísame de la próxima edición".
 * El parpadeo de lo que hay que pulsar se apaga con "reducir movimiento".
 */

const sb = supabase as any;
const CLAVE_AHORA_NO = 'xpeak_aviso_concurso_ahora_no';
const CLAVE_PROXIMA = 'xpeak_proxima_edicion_ok';

const lee = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const guarda = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };

// 1. Tras votar: "¿Quieres que te avisemos del resultado y del próximo concurso?"
export function AvisoResultado({ version }: { version: number }) {
  const { user } = useAuth();
  const [consiente, setConsiente] = useState<boolean | null>(null);
  const [haVotado, setHaVotado] = useState(false);
  const [ahoraNo, setAhoraNo] = useState(() => lee(CLAVE_AHORA_NO) === '1');
  const [hecho, setHecho] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelado = false;
    Promise.all([
      sb.from('profiles').select('marketing_consent').eq('user_id', user.id).order('is_primary', { ascending: false }).limit(1).maybeSingle(),
      sb.from('feed_likes').select('id', { count: 'exact', head: true }).eq('user_id', user.id).like('content_key', 'concurso-dj-madrid-2026:%'),
    ]).then(([perfil, votos]: [{ data: { marketing_consent: boolean } | null }, { count: number | null }]) => {
      if (cancelado) return;
      setConsiente(perfil.data ? !!perfil.data.marketing_consent : null);
      setHaVotado((votos.count ?? 0) > 0);
    });
    return () => { cancelado = true; };
  }, [user, version]);

  if (!user) return null;
  if (hecho) {
    return (
      <p className="mt-8 rounded-[24px] px-5 py-4 text-sm flex items-center gap-2" style={{ background: TONES.leaf.card, color: TONES.leaf.stroke, fontFamily: HZ.body, fontWeight: 800, boxShadow: clay(TONES.leaf.rgb, 'sm') }}>
        <Check size={16} /> Hecho. Te avisaremos del resultado y de los próximos concursos.
      </p>
    );
  }
  if (!haVotado || consiente !== false || ahoraNo) return null;

  const acepta = async () => {
    setGuardando(true);
    const { error } = await sb.rpc('set_marketing_consent', { p_valor: true });
    setGuardando(false);
    if (error) { toast.error('No se ha podido guardar. Inténtalo en un momento.'); return; }
    setHecho(true);
  };

  return (
    <section className="mt-8 rounded-[28px] p-5 sm:p-6" style={{ background: HZ.surface, boxShadow: clay(TONES.sun.rgb, 'md') }}>
      <p className="text-lg flex items-center gap-2 mb-1" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>
        <Bell size={18} /> Voto contado
      </p>
      <p className="text-sm mb-4" style={{ color: HZ.inkSoft, fontFamily: HZ.body, fontWeight: 600 }}>
        ¿Quieres que te avisemos del resultado y del próximo concurso? Solo te escribiremos de eso y puedes darte de baja cuando quieras.{' '}
        <a href="/privacidad" className="underline">Privacidad</a>
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" onClick={acepta} disabled={guardando}
          className="px-6 py-3 rounded-full text-white text-base disabled:opacity-60 animate-pulse motion-reduce:animate-none"
          style={{ background: '#16a34a', fontFamily: HZ.body, fontWeight: 800, boxShadow: clayButton('22,163,74') }}>
          {guardando ? 'Guardando…' : 'Sí, avísame'}
        </button>
        <button type="button" onClick={() => { guarda(CLAVE_AHORA_NO, '1'); setAhoraNo(true); }}
          className="px-4 py-2 rounded-full text-sm" style={{ color: HZ.inkSoft, fontFamily: HZ.body, fontWeight: 700 }}>
          Ahora no
        </button>
      </div>
    </section>
  );
}

// 2. En la tarjeta del propio aspirante: "Pide el voto" con su enlace y un mensaje.
export function PedirVoto({ nombre }: { nombre: string | null }) {
  const compartir = async () => {
    const enlace = enlacePedirVoto(nombre);
    const texto = mensajePedirVoto(enlace);
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'Concurso DJ XPEAK Madrid', text: texto });
        return;
      }
      await navigator.clipboard.writeText(texto);
      toast.success('Mensaje copiado. Pégalo en tus stories, WhatsApp o donde quieras.');
    } catch (err) {
      // Cerrar la hoja de compartir sin enviar lanza AbortError: no es un fallo.
      if ((err as { name?: string })?.name !== 'AbortError') toast.error('No se ha podido copiar. Copia este enlace: ' + enlace);
    }
  };
  return (
    <button type="button" onClick={compartir}
      className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-base animate-pulse motion-reduce:animate-none"
      style={{ background: `linear-gradient(135deg,#D4AF37,#B8941E)`, color: '#2a1d00', fontFamily: HZ.body, fontWeight: 800, boxShadow: clayButton('184,148,30') }}>
      <Share2 size={18} /> Pide el voto a tus amigos
    </button>
  );
}

// 3. "¿Eres DJ? Avísame de la próxima edición."
export function ProximaEdicionDJ() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>(() => (lee(CLAVE_PROXIMA) === '1' ? 'ok' : 'idle'));

  const destino = (user?.email ?? email).trim().toLowerCase();
  const puede = emailValido(destino) && estado !== 'enviando';

  const apuntar = async () => {
    if (!puede) return;
    setEstado('enviando');
    const { error } = await sb.from('leads').insert({
      email: destino, source: FUENTE_PROXIMA_EDICION, intent: 'avisar-proxima-edicion',
      lead_role: 'dj', article_path: '/concurso-dj-madrid/aspirantes',
    });
    if (error) { setEstado('error'); return; }
    guarda(CLAVE_PROXIMA, '1');
    setEstado('ok');
  };

  return (
    <section className="mt-10 rounded-[28px] p-5 sm:p-7" style={{ background: TONES.sky.card, boxShadow: clay(TONES.sky.rgb, 'md') }}>
      <p className="text-xl sm:text-2xl flex items-center gap-2 mb-1" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>
        <Disc3 size={22} /> ¿Eres DJ?
      </p>
      {estado === 'ok' ? (
        <p className="text-sm flex items-center gap-2" style={{ color: TONES.leaf.stroke, fontFamily: HZ.body, fontWeight: 800 }}>
          <Check size={16} /> Apuntado. Te avisamos cuando abra la inscripción de la próxima edición.
        </p>
      ) : (
        <>
          <p className="text-sm mb-4" style={{ color: HZ.inkSoft, fontFamily: HZ.body, fontWeight: 600 }}>
            Apúntate y te avisamos cuando abra la inscripción de la próxima edición del concurso. Solo te escribiremos de eso.{' '}
            <a href="/privacidad" className="underline">Privacidad</a>
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {!user && (
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" inputMode="email"
                className="flex-1 min-w-[12rem] px-4 py-3 rounded-full text-base bg-white" style={{ fontFamily: HZ.body, fontWeight: 600 }} aria-label="Tu email" />
            )}
            <button type="button" onClick={apuntar} disabled={!puede}
              className="px-6 py-3 rounded-full text-white text-base disabled:opacity-50"
              style={{ background: '#2563EB', fontFamily: HZ.body, fontWeight: 800, boxShadow: clayButton('37,99,235') }}>
              {estado === 'enviando' ? 'Apuntando…' : user ? `Avísame a ${user.email ?? 'mi email'}` : 'Avísame'}
            </button>
          </div>
          {estado === 'error' && <p className="text-xs mt-3" style={{ color: '#b91c1c' }}>No se ha podido guardar. Inténtalo en un momento.</p>}
        </>
      )}
    </section>
  );
}
