import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Radio, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useDirectoAhora } from '@/hooks/useDirectoAhora';
import { ROLE_LABELS } from '@/hooks/useActivityFeed';
import { DIRECTO_HORAS_MAX, directoVigente, enlaceDirectoValido, puedeHacerDirecto } from '@/lib/directo';
import DirectoPlayer from '@/components/directo/DirectoPlayer';
import { medirDirecto } from '@/lib/track';
import PildoraDirecto from '@/components/directo/PildoraDirecto';

const card = { background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' } as const;
const botonOro = { background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' } as const;

const IDEAS: Record<string, string> = {
  dj: 'Una sesión completa o un ensayo de tu próximo evento.',
  staff: 'Cómo montas una barra o preparas un cóctel de la carta.',
  azafata: 'Cómo trabajas un evento: recepción, acreditaciones, trato.',
  makeup: 'Un maquillaje o peinado en tiempo real, paso a paso.',
  peluqueria: 'Un peinado de evento en tiempo real, paso a paso.',
  media: 'Cómo editas o retocas el material de un evento.',
  catering: 'Cocinando un plato de tu carta o montando un buffet.',
  mago: 'Un número de close-up o tu show completo.',
};
const IDEA_GENERICA = 'Muestra cómo trabajas: es lo que más ayuda a que te elijan.';

export default function DirectoView() {
  const profile = useProfile();
  const { directos } = useDirectoAhora(undefined, 30_000);
  const puede = puedeHacerDirecto(profile.role);

  const [enlace, setEnlace] = useState(profile.stream_url ?? '');
  const [titulo, setTitulo] = useState(profile.stream_title ?? '');
  const [guardando, setGuardando] = useState(false);
  const enlaceOk = useMemo(() => enlaceDirectoValido(enlace), [enlace]);

  const propio = directos.find(d => d.user_id === profile.user_id && d.id === profile.profileId);
  const enDirecto = !!propio && directoVigente({ is_live: true, stream_url: propio.stream_url, live_started_at: propio.live_started_at });
  const ajenos = directos.filter(d => d.id !== profile.profileId);

  const empezar = async () => {
    if (!profile.profileId) { toast.error('Tu perfil aún se está cargando. Vuelve a intentarlo en unos segundos.'); return; }
    if (!enlaceOk) { toast.error('Pega el enlace de tu canal de Twitch (twitch.tv/tunombre) o el de tu directo de YouTube.'); return; }
    setGuardando(true);
    const { error } = await (supabase.from('profiles') as any)
      .update({ stream_url: enlace.trim(), stream_title: titulo.trim() || null, is_live: true, live_started_at: new Date().toISOString() })
      .eq('id', profile.profileId);
    setGuardando(false);
    if (error) { toast.error('No se pudo empezar el directo: ' + error.message); return; }
    await profile.refresh();
    medirDirecto('empezar', 'panel', profile.user_id);
    toast.success('Ya apareces en directo en XPEAK. Empieza a emitir en Twitch.');
  };

  const terminar = async () => {
    if (!profile.profileId) return;
    setGuardando(true);
    const { error } = await (supabase.from('profiles') as any)
      .update({ is_live: false, live_started_at: null })
      .eq('id', profile.profileId);
    setGuardando(false);
    if (error) { toast.error('No se pudo terminar el directo: ' + error.message); return; }
    await profile.refresh();
    medirDirecto('terminar', 'panel', profile.user_id);
    toast.success('Directo terminado.');
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease] max-w-3xl flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          Directos en <span className="text-gradient">XPEAK</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          {puede
            ? 'Emite por Twitch o YouTube y tu ficha aparece "en directo" en XPEAK: en la portada, en tu perfil y en el panel de todos. Quien te vea puede pedirte presupuesto al momento.'
            : 'Profesionales emitiendo ahora mismo. Míralos trabajar y pídeles presupuesto sin salir de XPEAK.'}
        </p>
      </div>

      {puede && (
        <section className="rounded-2xl p-4 sm:p-5 flex flex-col gap-4" style={card}>
          <div className="flex items-center gap-3 flex-wrap">
            <Radio size={18} style={{ color: '#8B6A00' }} />
            <h3 className="font-bold">Tu directo</h3>
            {enDirecto && <PildoraDirecto texto="En directo ahora" />}
          </div>

          {enDirecto ? (
            <>
              <p className="text-sm" style={{ color: '#4a3f2a' }}>
                Estás visible como "en directo" en XPEAK. Se apaga solo a las {DIRECTO_HORAS_MAX} horas si te olvidas de terminarlo.
              </p>
              <div className="flex gap-2.5 flex-wrap">
                <button type="button" onClick={terminar} disabled={guardando}
                  className="font-black text-sm px-5 py-2.5 rounded-xl disabled:opacity-60" style={{ background: '#1a1208', color: '#fff' }}>
                  Terminar directo
                </button>
                <Link to={`/p/${profile.user_id}`} target="_blank"
                  className="inline-flex items-center gap-1.5 font-bold text-sm px-4 py-2.5 rounded-xl" style={{ border: '1px solid rgba(212,175,55,0.6)', color: '#7a6216' }}>
                  Ver mi ficha <ExternalLink size={14} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <ol className="text-sm flex flex-col gap-1.5 list-decimal pl-5" style={{ color: '#4a3f2a' }}>
                <li>Prepara tu emisión en <b>Twitch</b> o <b>YouTube</b>.</li>
                <li>Pega aquí el enlace: en Twitch el de tu canal; en YouTube el del directo (cada directo tiene el suyo, no sirve el del canal).</li>
                <li>Pulsa <b>Empezar directo</b> y empieza a emitir en Twitch.</li>
              </ol>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="directo-enlace">
                  Enlace del directo o del canal
                  <input id="directo-enlace" value={enlace} onChange={e => setEnlace(e.target.value)} placeholder="twitch.tv/tunombre" inputMode="url" autoComplete="off"
                    className="rounded-xl px-3 py-2.5 text-sm font-normal" style={{ border: '1px solid rgba(10,9,8,0.15)', background: '#fff' }} />
                  {enlace.trim() !== '' && !enlaceOk && <span className="text-xs font-normal" style={{ color: '#b91c1c' }}>Pega un enlace de Twitch (twitch.tv/tunombre) o el de un directo de YouTube.</span>}
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="directo-titulo">
                  Título (opcional)
                  <input id="directo-titulo" value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={80} placeholder="Sesión de viernes, cómo preparo mi barra..."
                    className="rounded-xl px-3 py-2.5 text-sm font-normal" style={{ border: '1px solid rgba(10,9,8,0.15)', background: '#fff' }} />
                </label>
                <div>
                  <button type="button" onClick={empezar} disabled={guardando || !enlaceOk}
                    className="font-black text-sm px-6 py-3 rounded-xl disabled:opacity-50" style={botonOro}>
                    Empezar directo
                  </button>
                </div>
              </div>
              {enlaceOk && (
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: '#6b7280' }}>Así se verá en tu ficha:</p>
                  <DirectoPlayer origen="panel_previa" url={enlace} titulo={titulo.trim() || 'Vista previa de tu directo'} />
                </div>
              )}
            </>
          )}

          <div className="text-sm rounded-xl p-3" style={{ background: '#FBF3DD', color: '#4a3f2a' }}>
            <b>Idea para tu oficio:</b> {IDEAS[profile.role] ?? IDEA_GENERICA}
            <br />
            <span className="text-xs">Si pones música con derechos, desactiva en Twitch el guardado de emisiones anteriores (Ajustes, Emisión): las grabaciones son lo que Twitch silencia, el directo no.</span>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h3 className="font-bold">{puede ? 'Ahora en directo en XPEAK' : 'En directo ahora'}</h3>
        {ajenos.length === 0 ? (
          <p className="text-sm rounded-2xl p-4" style={{ ...card, color: '#4a3f2a' }}>
            Ahora mismo no hay nadie emitiendo. Cuando alguien empiece, aparecerá aquí y en la portada de XPEAK.
          </p>
        ) : ajenos.map(d => (
          <Link key={d.id} to={`/p/${d.user_id}`} className="flex items-center gap-3 rounded-2xl p-3" style={card}>
            {d.photo_url
              ? <img src={d.photo_url} alt="" className="rounded-full object-cover flex-shrink-0" width={44} height={44} style={{ width: 44, height: 44 }} />
              : <span className="rounded-full flex-shrink-0" style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#c9a24a,#6b4a1a)' }} />}
            <span className="min-w-0 flex-1">
              <span className="block font-bold truncate">{d.display_name ?? 'Profesional'}</span>
              <span className="block text-xs truncate" style={{ color: '#4a3f2a' }}>
                {[ROLE_LABELS[d.role ?? ''] ?? d.role, d.zone, d.stream_title].filter(Boolean).join(' · ')}
              </span>
            </span>
            <PildoraDirecto texto="Ver" />
          </Link>
        ))}
      </section>
    </div>
  );
}
