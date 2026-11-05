import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import { fetchAllDirectorioProfilesByRole, profileUrl, type DirProfile } from '@/pages/DirectorioPublico';
import { fotoOptimizada } from '@/lib/imagen';

const CANONICAL = 'https://xpeak.es/navidad';
const TITLE = 'Especial Navidad: Reyes Magos, Papá Noel, DJs, sonido y luces para tu evento | XPEAK';
const DESC = 'Todo para una cena de empresa o fiesta de Navidad en España: Reyes Magos, Baltasar y Papá Noel, DJs, alquiler de sonido e iluminación, catering, camareros, photo booth y más. Perfiles reales y contacto directo.';

// DJs para Navidad: solo generalistas (cena de empresa, familias), no un solo
// estilo de cabina. Decision de Daniel, 5 nov 2026.
const GENERALISTA = ['Todo tipo de música', 'Comercial', 'Top 40', 'Hits actuales', 'Remember', 'Pop Rock', 'Pachanga', 'Disco', 'Reggaetón', 'Hip Hop', 'R&B', 'Latin House'];
const soloGeneralistas = (p: DirProfile) => (p.genres ?? []).some(g => GENERALISTA.includes(g));

type Bloque = { id: string; titulo: string; texto: string; slug: string; roles: string[]; filtro?: (p: DirProfile) => boolean };
const BLOQUES: Bloque[] = [
  { id: 'personajes', titulo: 'Reyes Magos, Baltasar y Papá Noel', texto: 'Personajes navideños para cenas de empresa, centros comerciales, colegios y fiestas: Reyes Magos, Baltasar, Papá Noel, pajes y elfos.', slug: 'navidad', roles: ['navidad'] },
  { id: 'sonido', titulo: 'Sonido e iluminación', texto: 'Alquiler de sonido, luces y pantallas, y técnicos para montar el evento.', slug: 'alquiler-equipos', roles: ['alquiler', 'tecnico'] },
  { id: 'musica', titulo: 'DJs y música para la fiesta', texto: 'DJs que pinchan de todo (comercial, remember, latino, hits actuales) y grupos musicales para una cena o fiesta de Navidad.', slug: 'dj', roles: ['dj', 'grupo-musical', 'disco-movil'], filtro: undefined },
  { id: 'cena', titulo: 'Cena, cóctel y barra', texto: 'Catering, camareros y food trucks para la cena de empresa o la fiesta.', slug: 'catering', roles: ['catering', 'staff', 'food-truck'] },
  { id: 'animacion', titulo: 'Animación y espectáculo', texto: 'Magos, humoristas, animadores y bailarines para que la fiesta no se quede en la cena.', slug: 'mago', roles: ['mago', 'humorista', 'animador', 'bailarin'] },
  { id: 'recuerdo', titulo: 'Recuerdo y recepción', texto: 'Photo booth, fotografía, azafatas y presentadores para recibir y recordar el evento.', slug: 'photo-booth', roles: ['photo-booth', 'fotografo', 'media', 'azafata', 'speaker'] },
];

const Tarjeta = ({ p }: { p: DirProfile }) => (
  <a href={profileUrl(p)} className="block overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
    <div className="aspect-[4/3] w-full overflow-hidden" style={{ background: 'rgba(212,175,55,0.1)' }}>
      {p.photo_url && <img src={fotoOptimizada(p.photo_url, 600)} alt={p.display_name} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: '50% 10%' }} />}
    </div>
    <div className="p-3">
      <p className="text-sm font-bold" style={{ color: '#1a1208' }}>{p.display_name}</p>
      <p className="text-xs" style={{ color: '#555' }}>{[p.specialty, p.zone].filter(Boolean).join(' · ')}</p>
      {p.hourly_rate ? <p className="mt-1 text-xs font-semibold" style={{ color: '#8B6A00' }}>Desde {p.hourly_rate} €/h</p> : null}
    </div>
  </a>
);

export default function NavidadLanding() {
  const { data: byRole = {} } = useQuery({
    queryKey: ['navidad-landing-perfiles'],
    queryFn: () => fetchAllDirectorioProfilesByRole('Todas'),
    staleTime: 5 * 60_000,
  });

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'XPEAK', item: 'https://xpeak.es/' },
      { '@type': 'ListItem', position: 2, name: 'Especial Navidad', item: CANONICAL },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#222' }}>
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#1a1208' }}>XPEAK</a>
          <a href="/auth?mode=register&role=empresario" className="rounded-lg px-3 py-2 text-xs font-bold sm:px-4 sm:text-sm" style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#1a1208' }}>Pedir para mi evento</a>
        </nav>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-black sm:text-4xl" style={{ color: '#1a1208' }}>Especial Navidad: todo para tu cena de empresa o fiesta navideña</h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base" style={{ color: '#444' }}>
            Reyes Magos, Baltasar y Papá Noel, DJs, sonido e iluminación, catering, camareros, photo booth y más, en un solo sitio. Son perfiles de profesionales reales de XPEAK: ves su ficha, su tarifa y contactas directamente con quien contratas, con contrato y factura.
          </p>

          {BLOQUES.map(b => {
            const lista = b.roles.flatMap(r => byRole[r] ?? []).filter((p, i, a) => a.findIndex(q => q.user_id === p.user_id) === i);
            const vistos = (b.id === 'musica' ? lista.filter(p => p.role !== 'dj' || soloGeneralistas(p)) : lista).slice(0, 6);
            return (
              <section key={b.id} className="mt-10" aria-labelledby={`h-${b.id}`}>
                <h2 id={`h-${b.id}`} className="text-lg font-black sm:text-xl" style={{ color: '#1a1208' }}>{b.titulo}</h2>
                <p className="mt-1 max-w-3xl text-sm" style={{ color: '#555' }}>{b.texto}</p>
                {vistos.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {vistos.map(p => <Tarjeta key={p.user_id} p={p} />)}
                  </div>
                ) : b.id === 'personajes' ? (
                  <p className="mt-4 rounded-xl p-4 text-sm" style={{ background: 'rgba(212,175,55,0.1)', color: '#5a4400' }}>
                    Estamos incorporando los primeros Reyes Magos, Baltasar y Papá Noel. Si es tu trabajo, <a className="font-bold underline" href="/auth?mode=register&role=navidad">publica tu perfil</a>; si necesitas uno para tu evento, <a className="font-bold underline" href="/auth?mode=register&role=empresario">cuéntanos fecha y ciudad</a>.
                  </p>
                ) : null}
                <p className="mt-3 text-sm"><a className="font-bold underline" style={{ color: '#8B6A00' }} href={`/directorio/${b.slug}`}>Ver todo el directorio: {b.titulo.toLowerCase()}</a></p>
              </section>
            );
          })}

          <section className="mt-12 rounded-2xl p-5" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <h2 className="text-lg font-black" style={{ color: '#1a1208' }}>Cómo organizar tu evento de Navidad</h2>
            <p className="mt-2 text-sm" style={{ color: '#444' }}>
              Las cenas de empresa y las fiestas de diciembre se cierran con semanas de antelación y las fechas de Reyes se llenan pronto. Pide tu fecha cuanto antes y compara perfiles.
              Para organizar una cena de empresa, tienes <a className="font-bold underline" href="/blog/como-organizar-fiesta-de-empresa">la guía para organizar una fiesta de empresa</a>.
            </p>
          </section>
        </main>
        <FooterPublic />
      </div>
    </>
  );
}
