import { Helmet } from 'react-helmet-async';
import { Zap, ArrowLeft } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';

export default function BlogCuantosCalmarerosBoda() {
  const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' },
    { '@type': 'ListItem', position: 3, name: 'Cuántos camareros necesito para mi boda: guía definitiva 2026', item: 'https://xpeak.es/blog/cuantos-camareros-necesito-para-mi-boda' },
  ],
};

const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: '¿Cuántos camareros necesito para una boda de 100 personas?', acceptedAnswer: { '@type': 'Answer', text: 'Para una boda de 100 personas necesitas entre 6 y 10 camareros: 2-3 para el cóctel, 5-6 para la cena sentada y 1-2 bartenders para la barra libre.' } },
      { '@type': 'Question', name: '¿Cuánto personal de sala necesito para una boda de 200 personas?', acceptedAnswer: { '@type': 'Answer', text: 'Para 200 invitados: 4-5 camareros para cóctel, 8-12 para la cena y 2-3 bartenders para barra libre. Total aproximado: 14-20 personas.' } },
      { '@type': 'Question', name: '¿Qué personal necesito además de camareros para una boda?', acceptedAnswer: { '@type': 'Answer', text: 'Además de camareros y barmanes, para una boda completa puedes necesitar: jefe de sala, coordinador de logística, personal de cocina (si el catering no lo incluye) y personal de recogida.' } },
    ],
  };

  const articleStructured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cuántos camareros necesito para mi boda: la guía definitiva 2026',
    datePublished: '2026-04-15',
    dateModified: '2026-06-08',
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    description: 'Guía definitiva 2026: cuántos camareros necesitas para tu boda según el número de invitados, formato del servicio y tipo de evento.',
  };

  const RATIOS = [
    { invitados: '50', coctel: 2, cena: 3, barra: 1, total: '4–6' },
    { invitados: '75', coctel: 3, cena: 5, barra: 1, total: '6–8' },
    { invitados: '100', coctel: 3, cena: 6, barra: 2, total: '8–10' },
    { invitados: '150', coctel: 4, cena: 8, barra: 2, total: '11–14' },
    { invitados: '200', coctel: 5, cena: 12, barra: 3, total: '14–18' },
    { invitados: '300', coctel: 7, cena: 18, barra: 4, total: '20–26' },
  ];

  return (
    <>
      <Helmet>
        <title>Cuántos camareros para mi boda: guía 2026 | XPEAK</title>
        <meta name="description" content="Guía definitiva 2026: cuántos camareros necesitas para tu boda según los invitados y el tipo de servicio. Tabla de ratios y consejos prácticos." />
        <link rel="canonical" href="https://xpeak.es/blog/cuantos-camareros-necesito-para-mi-boda" />
        <meta property="og:title" content="Cuántos camareros necesito para mi boda 2026 — XPEAK" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xpeak.es/blog/cuantos-camareros-necesito-para-mi-boda" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cuántos camareros necesito para mi boda 2026" />
        <meta name="twitter:description" content="Guía definitiva 2026: cuántos camareros necesitas para tu boda según los invitados y el tipo de servicio." />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(articleStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#2563EB' }}>XPEAK</a>
          <a href="/auth"
            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>
            Unirse gratis
          </a>
        </nav>
        <a href="/blog" className="block px-4 sm:px-6 pb-2 max-w-3xl mx-auto text-xs" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/contratar-camareros" className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-60"
            style={{ color: 'rgba(37,99,235,0.7)' }}>
            <ArrowLeft size={12} /> Contratar camareros para bodas
          </a>

          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded"
              style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.2)' }}>
              Guía de bodas · 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Cuántos camareros necesito para mi boda: la guía definitiva 2026
          </h1>
          <p className="text-base sm:text-base mb-8 leading-relaxed" style={{ color: '#333' }}>
            Una de las dudas más frecuentes al organizar una boda: ¿cuántos camareros contratar? Demasiado pocos y el servicio colapsa. Demasiados y el presupuesto se dispara. Esta guía te da los ratios exactos del sector.
          </p>

          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-black mb-4">Tabla: camareros necesarios según el número de invitados</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: 'rgba(37,99,235,0.08)' }}>
                    {['Invitados', 'Cóctel', 'Cena sentada', 'Barra libre', 'Total estimado'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-bold" style={{ color: '#2563EB', borderBottom: '1px solid rgba(37,99,235,0.2)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATIOS.map((row, i) => (
                    <tr key={row.invitados} style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                      <td className="px-4 py-3 font-bold">{row.invitados}</td>
                      <td className="px-4 py-3" style={{ color: '#222' }}>{row.coctel}</td>
                      <td className="px-4 py-3" style={{ color: '#222' }}>{row.cena}</td>
                      <td className="px-4 py-3" style={{ color: '#222' }}>{row.barra}</td>
                      <td className="px-4 py-3 font-black" style={{ color: '#2563EB' }}>{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: '#555' }}>
              * Ratios estándar del sector. Pueden variar según el espacio, el tipo de menú y la duración del evento.
            </p>
          </section>

          <BlogInlineCTA role="staff" />

          <div className="space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">La regla de oro del catering de boda</h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#333' }}>
                En el sector del catering existe una regla sencilla que funciona para la mayoría de bodas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { formato: '🥂 Cóctel', ratio: '1 / 15–20 personas' },
                  { formato: '🍽️ Cena sentada', ratio: '1 / 8–10 personas' },
                  { formato: '🍹 Barra libre', ratio: '1 bartender / 30–40 personas' },
                ].map(({ formato, ratio }) => (
                  <div key={formato} className="p-4 rounded-xl text-center"
                    style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)' }}>
                    <p className="text-sm font-bold mb-1">{formato}</p>
                    <p className="text-xs font-black" style={{ color: '#2563EB' }}>{ratio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">Factores que aumentan la necesidad de personal</h2>
              <ul className="space-y-2">
                {[
                  'Menú de más de 3 platos con servicio en mesa (suma 1 camarero por cada 8 personas)',
                  'Espacio muy grande o en varios niveles (suma 10-20% más de personal)',
                  'Servicio de vinos por botella (requiere 1 sumiller cada 20 mesas)',
                  'Boda al aire libre con desplazamiento entre zonas (suma 1-2 camareros extra)',
                  'Invitados con movilidad reducida o niños (suma 1 camarero de apoyo)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#333' }}>
                    <span style={{ color: '#2563EB' }}>+</span> {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">Cuánto cuesta el personal de una boda</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#333' }}>
                Con los ratios anteriores y precios de mercado 2026, el presupuesto aproximado en personal de sala para una boda es:
              </p>
              <div className="space-y-2">
                {[
                  { inv: '50 invitados', rango: '400€ – 900€' },
                  { inv: '100 invitados', rango: '800€ – 1.800€' },
                  { inv: '150 invitados', rango: '1.200€ – 2.800€' },
                  { inv: '200 invitados', rango: '1.600€ – 3.800€' },
                ].map(({ inv, rango }) => (
                  <div key={inv} className="flex items-center justify-between p-3 rounded-lg text-sm"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ color: '#222' }}>{inv}</span>
                    <span className="font-black" style={{ color: '#2563EB' }}>{rango}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#555' }}>
                * Precios orientativos para servicio completo (cóctel + cena + barra) de 6-7 horas. No incluye catering.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black mb-3">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {[
                  { q: '¿El catering ya incluye personal de sala?', a: 'Depende del proveedor. Algunos caterings incluyen personal en el precio por cubierto; otros lo cobran aparte. Siempre pregunta qué incluye antes de firmar. En XPEAK puedes contratar personal de sala de forma independiente.' },
                  { q: '¿Cuándo debo contratar el personal de la boda?', a: 'Para bodas con más de 50 invitados, recomendamos reservar el personal con al menos 2-3 meses de antelación. El Flash Booking de XPEAK puede cubrir necesidades urgentes en menos de 1 semana, pero el personal más solicitado se reserva con anticipación.' },
                  { q: '¿Puedo mezclar camareros de diferentes agencias?', a: 'Puedes, pero es mejor que todo el personal de sala provenga del mismo equipo o tenga experiencia trabajando juntos. La coordinación es clave para que el servicio fluya bien.' },
                ].map(({ q, a }) => (
                  <div key={q} className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <p className="text-sm font-bold mb-2">{q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: '#111' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/staff-para-eventos', cat: 'Hub Staff', title: 'Staff para eventos: guía completa 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-camarero-de-eventos', cat: 'Staff', title: 'Cuánto cobra un camarero de eventos 2026' },
                  { href: '/blog/catering-boda-precio-por-persona', cat: 'Catering', title: 'Catering boda: precio por persona 2026' },
                  { href: '/blog/cuanto-cuesta-una-boda-en-espana', cat: 'Bodas', title: 'Cuánto cuesta una boda en España 2026' },
                  { href: '/blog/contratar-barman-evento-privado', cat: 'Staff', title: 'Barman evento privado: precio 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: '#222' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="mt-12 rounded-2xl p-7 text-center" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)' }}>
            <h2 className="text-xl font-black mb-2">Contrata el personal perfecto para tu boda</h2>
            <p className="text-sm mb-5" style={{ color: '#444' }}>
              Gratis para organizadores · Camareros verificados · Contrato digital automático
            </p>
            <a href="/contratar-camareros"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#2563EB,#B8941E)', color: '#000' }}>
              <Zap size={14} /> Buscar camareros para mi boda
            </a>
          </div>
          <BlogAuthor />
          <BlogShare />
        </article>
          <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/cuantos-camareros-necesito-para-mi-boda" />
        <BlogRelatedPosts currentSlug='/blog/cuantos-camareros-necesito-para-mi-boda' tag='Camareros' />
        <FooterPublic />
        <BlogScrollCTA role="staff" storageKey="xpeak_scrollcta_cuantos_calmareros_boda" />
      </div>
    </>
  );
}
