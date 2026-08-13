import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogScrollCTA from '@/components/BlogScrollCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogShare from '@/components/BlogShare';
import BlogAuthor from '@/components/BlogAuthor';
import DJResourcesAffiliate from '@/components/DJResourcesAffiliate';
import BlogAnswerBox from '@/components/BlogAnswerBox';

const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'DJ para boda civil: precio y qué canciones poner en cada momento (2026)', description: 'Guía completa de música para boda civil: cuánto cuesta el DJ, canciones para la entrada, firma y fiesta. Precios reales en España 2026.', datePublished: '2026-05-04',
  dateModified: '2026-05-25', author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es' }, publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } }, image: 'https://xpeak.es/og-image.jpg', url: 'https://xpeak.es/blog/dj-boda-civil-precio-canciones' };
const faqStructured = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto cuesta un DJ para una boda civil en España?', acceptedAnswer: { '@type': 'Answer', text: 'Un DJ para boda civil en España cuesta entre 600€ y 1.500€ para el servicio completo (ceremonia + cóctel + cena + pista de baile). Si solo contratas para la pista de baile (4-5h), el precio baja a 350-700€.' } },
  { '@type': 'Question', name: '¿Qué canciones se ponen en la entrada de la novia en una boda civil?', acceptedAnswer: { '@type': 'Answer', text: 'Las más elegidas para entrada de novia en boda civil: "A Thousand Years" (Christina Perri), "Canon in D" (Pachelbel versión contemporánea), "La vie en rose" (versión jazz), "Perfect" (Ed Sheeran versión instrumental), "Thinking Out Loud" (Ed Sheeran). La ventaja de la boda civil es que no hay restricciones religiosas.' } },
  { '@type': 'Question', name: '¿El DJ cubre también la ceremonia civil?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, muchos DJs de bodas incluyen un servicio de sonido y música para la ceremonia. Necesitas un equipo más pequeño (bafle + reproductor) y una lista de canciones para entrada, firma y salida. Algunos DJs cobran esto como extra (100-200€), otros lo incluyen en el pack total.' } },
  { '@type': 'Question', name: '¿Se puede poner reggaeton o música urbana en una boda civil?', acceptedAnswer: { '@type': 'Answer', text: 'En una boda civil puedes poner absolutamente cualquier música — no hay restricciones religiosas. Lo habitual es combinar estilos: música suave o romántica para ceremonia y cóctel, y pasar a música más animada (pop, urbano, años 80-90) a medida que avanza la noche.' } },
] };
const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://xpeak.es/blog' }, { '@type': 'ListItem', position: 3, name: 'DJ boda civil precio', item: 'https://xpeak.es/blog/dj-boda-civil-precio-canciones' }] };

const MOMENTOS = [
  { momento: 'Llegada de invitados', estilo: 'Lounge, jazz suave, acústico', ejemplo: 'Norah Jones, Jack Johnson, bossa nova' },
  { momento: 'Entrada de la novia', estilo: 'Emotivo, romántico, instrumental', ejemplo: 'A Thousand Years, Canon in D, La vie en rose' },
  { momento: 'Firma del acta', estilo: 'Fondo suave, sin letra', ejemplo: 'Instrumentales, ambient, cuerdas' },
  { momento: 'Salida de la pareja', estilo: 'Alegre, celebración', ejemplo: 'Signed, Sealed, Delivered; Happy; Crazy in Love' },
  { momento: 'Cóctel de bienvenida', estilo: 'Dinámico pero no muy alto', ejemplo: 'Pop actual, indie, funky house' },
  { momento: 'Cena', estilo: 'Ambiente, conversación posible', ejemplo: 'Nu jazz, lounge, pop internacional' },
  { momento: 'Vals / primer baile', estilo: 'La canción de los novios', ejemplo: 'La que elijáis — es vuestro momento' },
  { momento: 'Pista de baile', estilo: 'Progresivo, lecturas del ambiente', ejemplo: 'Pop, años 80/90, urbano, electrónica según invitados' },
];

export default function BlogDJBodaCivil() {
  return (
    <>
      <Helmet>
        <title>DJ boda civil: precio y canciones 2026 | XPEAK</title>
        <meta name="description" content="Cuánto cuesta un DJ para boda civil en España y qué canciones poner en la entrada, firma, cóctel y fiesta. Guía completa 2026." />
        <link rel="canonical" href="https://xpeak.es/blog/dj-boda-civil-precio-canciones" />
        <meta property="og:title" content="DJ para boda civil: precio y canciones 2026 — XPEAK Blog" />
        <meta property="og:description" content="Precio del DJ para boda civil y guía de canciones por momento: entrada, firma, cóctel y pista de baile." />
        <meta property="og:url" content="https://xpeak.es/blog/dj-boda-civil-precio-canciones" />
        <meta property="og:type" content="article" /><meta property="og:image" content="https://xpeak.es/og-image.jpg" /><meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3"><a href="/blog" className="text-xs font-bold " style={{ color: '#3d3d4e' }}>Blog</a><a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a></div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <a href="/blog" className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>← Todos los artículos</a>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>Bodas · XPEAK Blog</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">DJ para boda civil: precio y qué canciones poner en cada momento (2026)</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d4e' }}>En una boda civil tienes libertad total con la música. Te contamos cuánto cuesta el DJ y qué poner en cada momento para que fluya perfectamente.</p>
            <time className="text-xs mt-3 block" style={{ color: 'rgba(255,255,255,0.3)' }}>4 mayo 2026</time>
            <BlogAnswerBox
              question="¿Cuánto cuesta un DJ para una boda civil en España?"
              answer="Un DJ para una boda civil en España cuesta entre 600€ y 1.500€ para el servicio completo (ceremonia, cóctel, cena y pista de baile). Si solo se contrata para la pista de baile (4-5h), el precio baja a 350-700€. La boda civil no impone restricciones musicales, así que el repertorio es totalmente libre."
            />
          </div>
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black mb-4">Guía musical: qué poner en cada momento de la boda civil</h2>
              <div className="space-y-3">{MOMENTOS.map((m, i) => (<div key={m.momento} className="p-4 rounded-xl" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}><div className="flex items-start justify-between mb-1"><p className="text-xs font-bold">{m.momento}</p><span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{m.estilo}</span></div><p className="text-xs" style={{ color: '#3d3d4e' }}>{m.ejemplo}</p></div>))}</div>
            </section>
            <BlogInlineCTA role="dj" />

            <section>
              <h2 className="text-lg font-black mb-3">Precio del DJ para boda civil según servicio contratado</h2>
              <div className="space-y-2">{[{ s: 'Solo pista de baile (4-5h)', p: '350–700€' }, { s: 'Cóctel + pista de baile', p: '500–900€' }, { s: 'Ceremonia + cóctel + cena + pista', p: '700–1.500€' }, { s: 'Pack completo con equipo de luces', p: '900–1.800€' }].map((item, i) => (<div key={item.s} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}><p className="text-xs font-medium">{item.s}</p><span className="text-xs font-bold" style={{ color: '#D4AF37' }}>{item.p}</span></div>))}</div>
              <p className="text-xs mt-3" style={{ color: '#3d3d4e' }}>Precios orientativos España 2026. Sin IVA. Variable según ciudad y experiencia del DJ.</p>
            </section>
            <section>
              <h2 className="text-lg font-black mb-4">Preguntas frecuentes</h2>
              <div className="space-y-4">{faqStructured.mainEntity.map(f => (<div key={f.name} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}><h3 className="text-sm font-bold mb-2">{f.name}</h3><p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{f.acceptedAnswer.text}</p></div>))}</div>
            </section>
            
            <section className="mt-8">
              <h2 className="text-base font-black mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>Artículos relacionados</h2>
              <div className="space-y-2">
                {[
                  { href: '/blog/dj-para-eventos', cat: 'Hub DJ', title: 'DJ para eventos: guía completa de precios 2026' },
                  { href: '/blog/profesionales-bodas', cat: 'Hub Bodas', title: 'Profesionales para bodas: guía completa 2026' },
                  { href: '/blog/cuanto-cobra-un-dj-en-espana', cat: 'DJ', title: 'Cuánto cobra un DJ en España: precios 2026' },
                  { href: '/blog/musica-para-bodas-guia', cat: 'Bodas', title: 'Música para bodas: DJ, banda o playlist 2026' },
                  { href: '/blog/10-errores-contratar-dj-boda', cat: 'DJ', title: '10 errores al contratar DJ para tu boda' },
                  { href: '/blog/cuanto-cuesta-una-boda-en-espana', cat: 'Bodas', title: 'Cuánto cuesta una boda en España 2026' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>{link.cat}</span>
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-sm font-black mb-2">¿Buscas DJ para tu boda civil?</p>
              <p className="text-xs mb-4" style={{ color: '#3d3d4e' }}>XPEAK tiene DJs especializados en bodas en toda España. Compara perfiles, lee reseñas y contrata con contrato digital automático.</p>
              <a href="/contratar-dj" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver DJs de bodas en XPEAK →</a>
            </div>
          </div>
                  <DJResourcesAffiliate />

                  <BlogEmailCapture variant="presupuestos" intent="contratar-dj" articlePath="/blog/dj-boda-civil-precio-canciones" />
</main>
      <BlogAuthor />
        <BlogRelatedPosts currentSlug='/blog/dj-boda-civil-precio-canciones' tag='DJ' />
        <FooterPublic />
        <BlogScrollCTA role="dj" storageKey="xpeak_scrollcta_dj_boda_civil" />
      </div>
    </>
  );
}
