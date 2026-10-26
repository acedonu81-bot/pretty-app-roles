import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import CtaProfesional from '@/components/CtaProfesional';

// Plantilla de las guías "cómo trabajar de X" para profesionales (Ficha XDS
// 26 oct 2026, captación de profesionales). Cada artículo es un archivo con sus
// datos; la maqueta es la de BlogTrabajarCamareroEventos.

export interface GuiaTrabajar {
  path: string;
  titulo: string;          // <title> sin "| XPEAK"
  h1: string;
  metaDesc: string;
  ogDesc: string;
  migas: string;
  eyebrow: string;
  intro: string;
  fecha: string;           // ISO
  fechaTexto: string;
  // Sin datos con fuente, el artículo va sin tabla de precios (tarifas vacío).
  tituloTarifas?: string;
  tarifas: { perfil: string; tarifa: string }[];
  notaTarifas?: string;
  // Solo datos con fuente (decisión del usuario, 26 oct 2026: "no inventes
  // datos, y si hay fuentes nómbralas"). Cada cifra de tarifas sale de aquí o
  // de los perfiles de XPEAK.
  fuentes: { nombre: string; url: string; dato: string }[];
  secciones?: { titulo: string; parrafos: string[] }[];
  pasos: { paso: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relacionados: { href: string; cat: string; title: string }[];
  ctaSlug: string;         // slug de CtaProfesional
  tag: string;             // tag de BlogRelatedPosts
  scrollRole: 'dj_pro' | 'azafata_pro' | 'bailarin_pro' | 'grupo_musical_pro' | 'humorista_pro' | 'mago_pro' | 'speaker_pro' | 'vestuario_pro' | 'profesional_pro';
  storageKey: string;
}

export default function BlogGuiaTrabajar({ g }: { g: GuiaTrabajar }) {
  const url = `https://xpeak.es${g.path}`;
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: g.h1, description: g.metaDesc, datePublished: g.fecha, dateModified: g.fecha, author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url };
  const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: g.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: g.migas, item: url }] };
  const title = `${g.titulo} | XPEAK`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={g.metaDesc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={g.ogDesc} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-xs font-bold hidden sm:block" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/auth?mode=register" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse</a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#8B6A00' }}>{g.eyebrow} · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">{g.h1}</h1>
            <p className="text-base leading-relaxed" style={{ color: '#3d3d4e' }}>{g.intro}</p>
            <time dateTime={g.fecha} className="text-xs mt-3 block" style={{ color: '#666' }}>{g.fechaTexto}</time>
          </div>

          <div className="space-y-10">
            {g.tarifas.length > 0 && <section>
              <h2 className="text-lg font-black mb-4">{g.tituloTarifas}</h2>
              <div className="space-y-2">
                {g.tarifas.map((row, i) => (
                  <div key={row.perfil} className="flex items-center justify-between p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <p className="text-sm font-medium">{row.perfil}</p>
                    <span className="text-sm font-bold ml-4 shrink-0" style={{ color: '#8B6A00' }}>{row.tarifa}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>{g.notaTarifas}</p>
            </section>}

            {g.secciones?.map(s => (
              <section key={s.titulo}>
                <h2 className="text-lg font-black mb-4">{s.titulo}</h2>
                <div className="space-y-3">
                  {s.parrafos.map(p => <p key={p.slice(0, 40)} className="text-sm leading-relaxed" style={{ color: '#333' }}>{p}</p>)}
                </div>
              </section>
            ))}

            <section>
              <h2 className="text-lg font-black mb-4">Cómo empezar: {g.pasos.length} pasos</h2>
              <div className="space-y-4">
                {g.pasos.map((p, i) => (
                  <div key={p.paso} className="flex gap-4 p-5 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="text-xl font-black shrink-0 w-6 text-center leading-none mt-0.5" style={{ color: 'rgba(184,148,30,0.55)' }}>{i + 1}</span>
                    <div>
                      <h3 className="text-sm font-black mb-1.5">{p.paso}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#333' }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {g.faqs.map(f => (
                  <div key={f.q} className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <h3 className="text-sm font-bold mb-2">{f.q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#222' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {g.fuentes.length > 0 && <section>
              <h2 className="text-base font-black mb-3">Fuentes</h2>
              <ul className="space-y-2">
                {g.fuentes.map(f => (
                  <li key={f.url + f.dato} className="text-xs leading-relaxed" style={{ color: '#3d3d4e' }}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-bold underline" style={{ color: '#8B6A00' }}>{f.nombre}</a>: {f.dato}
                  </li>
                ))}
              </ul>
            </section>}

            <section>
              <h2 className="text-base font-black mb-3">Artículos relacionados</h2>
              <div className="space-y-2">
                {g.relacionados.map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.75rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.12)', color: '#8B6A00', border: '1px solid rgba(212,175,55,0.25)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
        <CtaProfesional slug={g.ctaSlug} origen="blog" />
        <BlogAuthor />
        <BlogShare />
        <BlogRelatedPosts currentSlug={g.path} tag={g.tag} />
        <FooterPublic />
        <BlogScrollCTA role={g.scrollRole} storageKey={g.storageKey} articlePath={g.path} />
      </div>
    </>
  );
}
