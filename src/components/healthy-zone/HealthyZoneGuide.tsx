import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import { HZ_GUIDES, HZ_PATH, getHZGuide } from '@/data/healthyZone';
import { HZ, TONES, clay, BLUE_RGB, SURFACE_RGB } from './clay';
import HZNav from './HZNav';
import HZIcon from './HZIcon';
import HZLeadForm from './HZLeadForm';
import HZMatchCard from './HZMatchCard';

// Plantilla común de las guías de la Healthy Zone (datos en src/data/healthyZone.ts).
export default function HealthyZoneGuide({ slug }: { slug: string }) {
  const g = getHZGuide(slug);
  const tone = TONES[g.tone];
  const url = `https://xpeak.es${g.slug}`;
  const otras = HZ_GUIDES.filter((x) => x.slug !== g.slug);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.h1,
    description: g.desc,
    datePublished: g.date,
    dateModified: g.date,
    author: { '@type': 'Person', name: 'Daniel', jobTitle: 'Fundador de XPEAK', url: 'https://xpeak.es/autor/daniel' },
    publisher: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es', logo: { '@type': 'ImageObject', url: 'https://xpeak.es/favicon.png' } },
    image: 'https://xpeak.es/og-image.jpg',
    url,
  };
  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: g.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: 'Healthy Zone', item: `https://xpeak.es${HZ_PATH}` },
      { '@type': 'ListItem', position: 3, name: g.short, item: url },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{`${g.title} | XPEAK`}</title>
        <meta name="description" content={g.desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${g.title} | XPEAK Healthy Zone`} />
        <meta property="og:description" content={g.desc} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <link rel="stylesheet" href={HZ.fontsHref} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen overflow-x-hidden" style={{ background: HZ.bg, color: HZ.ink, fontFamily: HZ.body }}>
        <HZNav />

        <header className="relative mx-4 sm:mx-10 mt-6 sm:mt-8 rounded-[36px] sm:rounded-[56px] overflow-hidden" style={{ background: tone.card, boxShadow: clay(tone.rgb, 'lg') }}>
          <div
            aria-hidden="true"
            className="absolute rounded-full hidden sm:block"
            style={{ right: -60, bottom: -90, width: 320, height: 320, background: tone.bubble, boxShadow: `inset -18px -18px 36px rgba(0,0,0,0.1), inset 18px 18px 36px rgba(255,255,255,0.5)` }}
          />
          <div className="relative max-w-3xl px-6 py-10 sm:px-16 sm:py-16 flex flex-col gap-5">
            <a href={HZ_PATH} className="self-start rounded-full px-4 py-2 text-xs uppercase" style={{ background: HZ.surface, color: HZ.blue, fontWeight: 800, letterSpacing: '2px', textDecoration: 'none', boxShadow: clay(BLUE_RGB, 'sm') }}>
              Healthy Zone · {g.short}
            </a>
            <h1 className="m-0 text-4xl sm:text-6xl leading-[1.02]" style={{ fontFamily: HZ.display, fontWeight: 800, letterSpacing: '-1.5px' }}>{g.h1}</h1>
            <p className="m-0 text-lg sm:text-xl leading-relaxed" style={{ color: '#24433B' }}>{g.intro}</p>
            <time dateTime={g.date} className="text-sm" style={{ color: HZ.inkSoft, fontWeight: 600 }}>{g.dateLabel} · Daniel, XPEAK</time>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 flex flex-col gap-12">
          <div className="rounded-[28px] p-6 sm:p-8" style={{ background: HZ.surface, boxShadow: clay(SURFACE_RGB, 'md') }}>
            <p className="m-0 mb-2 text-xs uppercase" style={{ color: HZ.green, fontWeight: 800, letterSpacing: '2px' }}>Respuesta rápida</p>
            <p className="m-0 mb-2 text-base xpeak-speakable-question" style={{ fontWeight: 800 }}>{g.answer.question}</p>
            <p className="m-0 text-base leading-relaxed xpeak-speakable-answer" style={{ color: HZ.inkSoft }}>{g.answer.answer}</p>
          </div>

          {g.sections.map((s) => (
            <section key={s.h2} className="flex flex-col gap-4">
              <h2 className="m-0 text-2xl sm:text-3xl" style={{ fontFamily: HZ.display, fontWeight: 800, letterSpacing: '-0.5px' }}>{s.h2}</h2>
              {s.paragraphs?.map((p, i) => (
                <p key={i} className="m-0 text-[17px] leading-[1.7]" style={{ color: '#1F3A33' }}>{p}</p>
              ))}
              {s.matchRole && <HZMatchCard role={s.matchRole} seed={`${g.slug}-${s.h2}`} />}
              {s.items && (
                <div className="flex flex-col gap-5">
                  {s.items.map((it) => (
                    <div key={it.title} className="rounded-[28px] p-5 sm:p-6" style={{ background: HZ.surface, boxShadow: clay(SURFACE_RGB, 'md') }}>
                      <h3 className="m-0 mb-1 text-lg" style={{ fontFamily: HZ.display, fontWeight: 800 }}>{it.title}</h3>
                      <p className="m-0 text-[15px] leading-relaxed" style={{ color: HZ.inkSoft }}>{it.text}</p>
                      {it.precio && (
                        <p className="m-0 mt-3 inline-block rounded-full px-3 py-1.5 text-sm" style={{ background: tone.card, color: tone.stroke, fontWeight: 800, boxShadow: clay(tone.rgb, 'sm') }}>
                          Precio orientativo: {it.precio}
                        </p>
                      )}
                      {it.matchRole && <HZMatchCard role={it.matchRole} seed={`${g.slug}-${it.title}`} />}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          <HZLeadForm origin={g.slug} title={g.formTitle} defaultPlan={g.plan} stacked />

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-2xl sm:text-3xl" style={{ fontFamily: HZ.display, fontWeight: 800 }}>Preguntas frecuentes</h2>
            {g.faq.map((f) => (
              <div key={f.q} className="rounded-[28px] p-5 sm:p-6" style={{ background: HZ.surface, boxShadow: clay(SURFACE_RGB, 'md') }}>
                <h3 className="m-0 mb-2 text-base" style={{ fontFamily: HZ.body, fontWeight: 800, letterSpacing: 0 }}>{f.q}</h3>
                <p className="m-0 text-[15px] leading-relaxed" style={{ color: HZ.inkSoft }}>{f.a}</p>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-xl sm:text-2xl" style={{ fontFamily: HZ.display, fontWeight: 800 }}>Profesionales en XPEAK</h2>
            <div className="flex flex-wrap gap-3">
              {g.directorio.map((d) => (
                <a key={d.href} href={d.href} className="rounded-full px-5 py-3 text-[15px]" style={{ background: HZ.surface, color: HZ.ink, fontWeight: 800, textDecoration: 'none', boxShadow: clay(SURFACE_RGB, 'sm') }}>
                  {d.label}
                </a>
              ))}
            </div>
          </section>
        </main>

        <section className="max-w-6xl mx-auto px-4 sm:px-10 pb-16 flex flex-col gap-6">
          <h2 className="m-0 text-2xl sm:text-3xl" style={{ fontFamily: HZ.display, fontWeight: 800 }}>Más de la Healthy Zone</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otras.map((o) => {
              const t = TONES[o.tone];
              return (
                <a key={o.slug} href={o.slug} className="rounded-[32px] p-6 flex flex-col gap-3 transition-transform hover:-translate-y-1" style={{ background: t.card, color: HZ.ink, textDecoration: 'none', boxShadow: clay(t.rgb, 'md') }}>
                  <HZIcon tone={o.tone} size={52} />
                  <span className="text-xl" style={{ fontFamily: HZ.display, fontWeight: 800 }}>{o.short}</span>
                  <span className="text-sm leading-relaxed" style={{ color: HZ.inkSoft }}>{o.cardText}</span>
                </a>
              );
            })}
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
