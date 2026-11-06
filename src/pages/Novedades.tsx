import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FooterPublic from '@/components/FooterPublic';
import {
  type Comunicado, esEnlaceInterno, idCortoDeSlug, slugNovedad, textoPlano, toSlugTexto, trocearCuerpo,
} from '@/lib/comunicados';

// Novedades públicas de XPEAK (6 nov 2026): solo los comunicados que el admin
// marca "Publicar también en la web". Solo el texto del admin y las menciones
// (enlaces a la ficha del profesional, que es lo que le da valor en Google).
// Los comentarios del panel nunca salen aquí.

type Publico = Pick<Comunicado, 'id' | 'titulo' | 'cuerpo' | 'imagen_url' | 'video_url' | 'cta_texto' | 'cta_url' | 'created_at'>;

const db = supabase as unknown as {
  from: (t: string) => { select: (c: string) => { eq: (k: string, v: boolean) => { order: (c: string, o: { ascending: boolean }) => { limit: (n: number) => Promise<{ data: unknown[] | null }> } } } };
};

const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

function Cuerpo({ cuerpo }: { cuerpo: string }) {
  return (
    <div className="text-base leading-relaxed whitespace-pre-line" style={{ color: '#333' }}>
      {trocearCuerpo(cuerpo).map((t, i) => t.tipo === 'texto'
        ? <span key={i}>{t.valor}</span>
        : <Link key={i} to={`/p/${toSlugTexto(t.nombre)}`} className="font-bold underline" style={{ color: '#8A6D0F' }}>{t.nombre}</Link>)}
    </div>
  );
}

function Cabecera() {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#1a1208' }}>X<span style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span></a>
      <Link to="/novedades" className="text-xs font-semibold" style={{ color: '#444' }}>Todas las novedades</Link>
    </nav>
  );
}

export default function Novedades() {
  const { slug } = useParams<{ slug?: string }>();
  const [lista, setLista] = useState<Publico[] | null>(null);

  useEffect(() => {
    db.from('comunicados').select('id, titulo, cuerpo, imagen_url, video_url, cta_texto, cta_url, created_at')
      .eq('publico', true).order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => setLista((data ?? []) as Publico[]));
  }, []);

  if (lista === null) return <div className="min-h-screen" style={{ background: '#FFFDF7' }} />;

  if (slug) {
    const corto = idCortoDeSlug(slug);
    const n = corto ? lista.find(x => x.id.startsWith(corto)) : undefined;
    if (!n) {
      return (
        <div className="min-h-screen" style={{ background: '#FFFDF7' }}>
          <Helmet><title>Novedad no encontrada | XPEAK</title><meta name="robots" content="noindex, follow" /></Helmet>
          <Cabecera />
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="mb-4">Esta novedad ya no está publicada.</p>
            <Link to="/novedades" className="font-bold underline" style={{ color: '#8A6D0F' }}>Ver todas las novedades</Link>
          </main>
          <FooterPublic />
        </div>
      );
    }
    const url = `https://xpeak.es/novedades/${slugNovedad(n.titulo, n.id)}`;
    const desc = textoPlano(n.cuerpo).slice(0, 155) || n.titulo;
    const jsonLd = {
      '@context': 'https://schema.org', '@type': 'NewsArticle', headline: n.titulo, description: desc,
      datePublished: n.created_at, url, ...(n.imagen_url ? { image: [n.imagen_url] } : {}),
      author: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
      publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    };
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
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7a6216' }}>
            Novedades XPEAK · {fechaLarga(n.created_at)}
          </p>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-6" style={{ color: '#111' }}>{n.titulo}</h1>
          {n.video_url ? (
            <video src={n.video_url} controls playsInline poster={n.imagen_url ?? undefined} className="w-full rounded-2xl mb-6 bg-black max-h-[70vh]" />
          ) : n.imagen_url ? (
            <img src={n.imagen_url} alt={n.titulo} className="w-full rounded-2xl mb-6 object-cover max-h-[70vh]" />
          ) : null}
          {n.cuerpo.trim() && <Cuerpo cuerpo={n.cuerpo} />}
          {n.cta_url && (esEnlaceInterno(n.cta_url) ? (
            <Link to={n.cta_url} className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold"
              style={{ background: '#D4AF37', color: '#1f2937' }}>{n.cta_texto || 'Ver más'} <ChevronRight size={15} /></Link>
          ) : (
            <a href={n.cta_url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold"
              style={{ background: '#D4AF37', color: '#1f2937' }}>{n.cta_texto || 'Ver más'} <ChevronRight size={15} /></a>
          ))}
          <div className="rounded-xl p-5 mt-10" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <p className="text-sm" style={{ color: '#444' }}>
              XPEAK es el directorio de profesionales para eventos en España.{' '}
              <Link to="/descubrir" className="font-bold underline" style={{ color: '#8A6D0F' }}>Busca DJs, camareros, fotógrafos y más</Link>
              {' '}o <Link to="/auth" className="font-bold underline" style={{ color: '#8A6D0F' }}>date de alta como profesional</Link>.
            </p>
          </div>
        </main>
        <FooterPublic />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFFDF7', color: '#222' }}>
      <Helmet>
        <title>Novedades de XPEAK: ganadores, profesionales y nuevos servicios para eventos</title>
        <meta name="description" content="Lo último de XPEAK: ganadores de concursos, profesionales destacados y nuevos servicios para eventos en España." />
        <link rel="canonical" href="https://xpeak.es/novedades" />
        {!lista.length && <meta name="robots" content="noindex, follow" />}
      </Helmet>
      <Cabecera />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-8" style={{ color: '#111' }}>Novedades XPEAK</h1>
        {!lista.length && <p>Pronto habrá novedades.</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map(n => (
            <Link key={n.id} to={`/novedades/${slugNovedad(n.titulo, n.id)}`} className="group">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FBF3DD 0%, #F3E2AE 100%)', border: '1px solid rgba(212,175,55,0.25)' }}>
                {n.imagen_url && <img src={n.imagen_url} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <p className="text-xs mt-2" style={{ color: '#6b7280' }}>{fechaLarga(n.created_at)}</p>
              <h2 className="font-bold leading-snug group-hover:underline" style={{ color: '#111' }}>{n.titulo}</h2>
            </Link>
          ))}
        </div>
      </main>
      <FooterPublic />
    </div>
  );
}
