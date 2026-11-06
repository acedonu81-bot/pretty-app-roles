import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Heart, MessageCircle, Pin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import FooterPublic from '@/components/FooterPublic';
import {
  CuerpoConMenciones, MetaComunicado, ORO, Portada, StatsComunicado, TituloComunicado,
} from '@/components/comunicados/ComunicadoPartes';
import {
  type Comunicado, esEnlaceInterno, idCortoDeSlug, ordenarComunicados, porcentajes, resumenSinTitulo, slugNovedad, textoPlano,
} from '@/lib/comunicados';

// Tablón público de XPEAK (6 nov 2026): lo ve cualquiera, sin cuenta, para que
// se note que hay movimiento. Solo los comunicados marcados "visible para todo
// el mundo". Los visitantes ven contadores (me gusta, comentarios, votos),
// nunca el texto de los comentarios. Para interactuar hay que entrar.

type Publico = Pick<Comunicado, 'id' | 'titulo' | 'cuerpo' | 'imagen_url' | 'video_url' | 'cta_texto' | 'cta_url' | 'categoria' | 'fijado'
  | 'created_at' | 'comentarios_on' | 'encuesta_pregunta' | 'encuesta_opciones' | 'encuesta_cierra_at'>;
interface Contadores { comunicado_id: string; likes: number; comentarios: number; votos: number[] | null }

const db = supabase as unknown as {
  from: (t: string) => { select: (c: string) => { eq: (k: string, v: boolean) => { order: (c: string, o: { ascending: boolean }) => { limit: (n: number) => Promise<{ data: unknown[] | null }> } } } };
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown[] | null }>;
};

const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

const aInteraccion = (k: Contadores | undefined) => k
  ? { comunicado_id: k.comunicado_id, likes: k.likes, comentarios: k.comentarios, yo_like: false, mi_voto: null, votos: k.votos }
  : undefined;

function Cabecera() {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-6xl mx-auto" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#1a1208' }}>X<span style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span></a>
      <Link to="/novedades" className="text-xs font-semibold" style={{ color: '#444' }}>Todas las novedades</Link>
    </nav>
  );
}

function Invitacion({ id }: { id?: string }) {
  const { user } = useAuth();
  const destino = id ? `/dashboard?view=comunicados&comunicado=${id}` : '/dashboard?view=comunicados';
  return (
    <div className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <div>
        <p className="font-bold" style={{ color: '#111827' }}>{user ? 'Participa en la conversación' : 'Únete a la conversación'}</p>
        <p className="text-sm mt-0.5" style={{ color: '#4b5563' }}>
          {user ? 'Da me gusta, comenta y vota desde tu panel.' : 'Entra o crea tu perfil en XPEAK para dar me gusta, comentar y votar.'}
        </p>
      </div>
      {user ? (
        <Link to={destino} className="shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: ORO, color: '#1f2937' }}>
          Ir a mi panel <ChevronRight size={15} />
        </Link>
      ) : (
        <Link to="/auth" className="shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: ORO, color: '#1f2937' }}>
          Entrar o registrarme <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}

export default function Novedades() {
  const { slug } = useParams<{ slug?: string }>();
  const [lista, setLista] = useState<Publico[] | null>(null);
  const [cuentas, setCuentas] = useState<Record<string, Contadores>>({});

  useEffect(() => {
    db.from('comunicados')
      .select('id, titulo, cuerpo, imagen_url, video_url, cta_texto, cta_url, categoria, fijado, created_at, comentarios_on, encuesta_pregunta, encuesta_opciones, encuesta_cierra_at')
      .eq('publico', true).order('created_at', { ascending: false }).limit(200)
      .then(async ({ data }) => {
        const filas = ordenarComunicados((data ?? []) as Publico[]);
        setLista(filas);
        if (filas.length) {
          const { data: k } = await db.rpc('comunicados_publicos_interaccion', { p_ids: filas.map(f => f.id) });
          const m: Record<string, Contadores> = {};
          for (const x of (k ?? []) as Contadores[]) m[x.comunicado_id] = x;
          setCuentas(m);
        }
      });
  }, []);

  if (lista === null) return <div className="min-h-screen" style={{ background: '#FFFDF7' }} />;

  // ── Detalle ──────────────────────────────────────────────────────────────
  if (slug) {
    const corto = idCortoDeSlug(slug);
    const n = corto ? lista.find(x => x.id.startsWith(corto)) : undefined;
    if (!n) {
      return (
        <div className="min-h-screen" style={{ background: '#FFFDF7' }}>
          <Helmet><title>Novedad no encontrada | XPEAK</title><meta name="robots" content="noindex, follow" /></Helmet>
          <Cabecera />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <p className="mb-4">Esta novedad ya no está publicada.</p>
            <Link to="/novedades" className="font-bold underline" style={{ color: '#8A6D0F' }}>Ver todas las novedades</Link>
          </main>
          <FooterPublic />
        </div>
      );
    }
    const k = cuentas[n.id];
    const url = `https://xpeak.es/novedades/${slugNovedad(n.titulo, n.id)}`;
    const desc = textoPlano(n.cuerpo).slice(0, 155) || n.titulo;
    const jsonLd = {
      '@context': 'https://schema.org', '@type': 'NewsArticle', headline: n.titulo, description: desc,
      datePublished: n.created_at, url, ...(n.imagen_url ? { image: [n.imagen_url] } : {}),
      author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
      publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    };
    const opciones = n.encuesta_opciones ?? [];
    const pct = porcentajes(k?.votos ?? opciones.map(() => 0));
    const totalVotos = (k?.votos ?? []).reduce((a, b) => a + b, 0);
    return (
      <div className="min-h-screen" style={{ background: '#FFFDF7', color: '#222' }}>
        <Helmet>
          <title>{`${n.titulo} | Novedades XPEAK`}</title>
          <meta name="description" content={desc} />
          <link rel="canonical" href={url} />
          <meta property="og:title" content={n.titulo} />
          <meta property="og:description" content={desc} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={n.imagen_url ?? 'https://xpeak.es/og-image.jpg'} />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
        <Cabecera />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20 space-y-5">
          <Link to="/novedades" className="text-sm font-bold" style={{ color: '#8A6D0F' }}>← Todas las novedades</Link>
          <MetaComunicado c={n} />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight" style={{ color: '#111' }}>{n.titulo}</h1>
          {n.video_url ? (
            <video src={n.video_url} controls playsInline poster={n.imagen_url ?? undefined} className="w-full rounded-2xl bg-black max-h-[70vh]" />
          ) : n.imagen_url ? (
            <img src={n.imagen_url} alt={n.titulo} className="w-full rounded-2xl object-contain max-h-[70vh]" style={{ background: '#FBF3DD' }} />
          ) : null}
          {n.cuerpo.trim() && <CuerpoConMenciones cuerpo={n.cuerpo} grande />}

          {n.cta_url && (esEnlaceInterno(n.cta_url) ? (
            <Link to={n.cta_url} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: ORO, color: '#1f2937' }}>
              {n.cta_texto || 'Ver más'} <ChevronRight size={15} />
            </Link>
          ) : (
            <a href={n.cta_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: ORO, color: '#1f2937' }}>
              {n.cta_texto || 'Ver más'} <ChevronRight size={15} />
            </a>
          ))}

          {opciones.length >= 2 && (
            <div className="rounded-2xl p-4 space-y-2" style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.35)' }}>
              {n.encuesta_pregunta && <p className="font-bold" style={{ color: '#111827' }}>{n.encuesta_pregunta}</p>}
              {opciones.map((o, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden text-sm" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div className="absolute inset-y-0 left-0" style={{ width: `${pct[i]}%`, background: 'rgba(212,175,55,0.2)' }} />
                  <div className="relative flex justify-between px-3 py-2"><span>{o}</span><span className="font-semibold">{pct[i]} %</span></div>
                </div>
              ))}
              <p className="text-xs" style={{ color: '#6b7280' }}>{totalVotos} {totalVotos === 1 ? 'voto' : 'votos'}. Para votar hay que entrar con tu cuenta.</p>
            </div>
          )}

          <div className="flex items-center gap-5 text-sm" style={{ color: '#4b5563' }}>
            <span className="inline-flex items-center gap-1.5"><Heart size={17} /> {k?.likes ?? 0} me gusta</span>
            {n.comentarios_on !== false && <span className="inline-flex items-center gap-1.5"><MessageCircle size={17} /> {k?.comentarios ?? 0} {(k?.comentarios ?? 0) === 1 ? 'comentario' : 'comentarios'}</span>}
          </div>

          <Invitacion id={n.id} />

          <p className="text-sm" style={{ color: '#4b5563' }}>
            XPEAK es el directorio de profesionales para eventos en España.{' '}
            <Link to="/descubrir" className="font-bold underline" style={{ color: '#8A6D0F' }}>Busca DJs, camareros, fotógrafos y más</Link>.
          </p>
        </main>
        <FooterPublic />
      </div>
    );
  }

  // ── Tablón ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#FFFDF7', color: '#222' }}>
      <Helmet>
        <title>Novedades de XPEAK: ganadores, profesionales y nuevos servicios para eventos</title>
        <meta name="description" content="Lo último de XPEAK: ganadores de concursos, profesionales destacados, encuestas y nuevos servicios para eventos en España." />
        <link rel="canonical" href="https://xpeak.es/novedades" />
        {!lista.length && <meta name="robots" content="noindex, follow" />}
      </Helmet>
      <Cabecera />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight" style={{ color: '#111' }}>Novedades XPEAK</h1>
          <p className="text-sm sm:text-base mt-1.5" style={{ color: '#4b5563' }}>Lo que pasa en la comunidad: ganadores, profesionales destacados, encuestas y avisos.</p>
        </div>

        {!lista.length && <p>Pronto habrá novedades.</p>}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((n, idx) => {
            const grande = idx === 0 && lista.length > 1;
            const resumen = resumenSinTitulo(n.cuerpo, n.titulo);
            return (
              <Link key={n.id} to={`/novedades/${slugNovedad(n.titulo, n.id)}`}
                className={`group rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-lg ${grande ? 'lg:col-span-2' : ''}`}
                style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
                <div className="relative aspect-[16/9] w-full" style={{ background: '#FBF3DD' }}>
                  <Portada c={n} />
                  {n.fijado && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,253,247,0.95)', color: '#6b5200' }}>
                      <Pin size={10} /> Fijado
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1.5 flex-1 flex flex-col">
                  <MetaComunicado c={n} />
                  <TituloComunicado className={`${grande ? 'text-xl' : 'text-base'} line-clamp-2 group-hover:underline underline-offset-2`}>{n.titulo}</TituloComunicado>
                  {resumen && <p className="text-sm leading-[1.4] line-clamp-3" style={{ color: '#4b5563' }}>{resumen}</p>}
                  <div className="pt-1 mt-auto">
                    <StatsComunicado c={n} i={aInteraccion(cuentas[n.id])} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!!lista.length && <Invitacion />}
      </main>
      <FooterPublic />
    </div>
  );
}
