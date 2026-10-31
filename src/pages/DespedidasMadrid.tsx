import { lazy, Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';
import { track } from '@/lib/track';

const ParticularRequestModal = lazy(() => import('@/components/ParticularRequestModal'));

// Ventana de prueba (Ficha XDS despedidas, 31 oct 2026). Sin oficio nuevo: usa la
// solicitud del particular con el tipo "Despedida" ya puesto. Se retira desde
// src/config/ventanasPrueba.json.
const URL = 'https://xpeak.es/despedidas-madrid';
const TITLE = 'Despedida de soltera o soltero en Madrid: DJ, catering y más | XPEAK';
const DESC = 'Pide para tu fecha el DJ, el catering, los camareros o el equipo de tu despedida en Madrid. Cuéntanos qué necesitas y te responden los profesionales que encajan.';

const SERVICIOS = [
  { servicio: 'DJ', t: 'DJ', d: 'Con la música que queréis, elegida por estilo, para que solo te escriban los que la ponen.' },
  { servicio: 'Catering', t: 'Catering', d: 'Picoteo, cena o brunch para el grupo, a vuestra medida.' },
  { servicio: 'Camareros', t: 'Camareros', d: 'Barra y servicio para que nadie del grupo tenga que atenderla.' },
  { servicio: 'Alquiler de equipo', t: 'Sonido y equipo', d: 'Altavoces, luces y lo que haga falta si la fiesta es en una casa o un local.' },
  { servicio: 'Fotógrafo / vídeo', t: 'Fotos y vídeo', d: 'Para que el recuerdo no dependa de un móvil con poca batería.' },
];

const PASOS = [
  { t: 'Cuéntanos la fecha y lo que necesitas', d: 'Una solicitud corta, sin crear cuenta ni contraseña.' },
  { t: 'Confirmas tu correo', d: 'Hasta entonces no se manda nada a nadie.' },
  { t: 'Te contestan por el chat', d: 'Los profesionales de Madrid que encajan con tu fecha te escriben y cerráis el precio entre vosotros.' },
];

export default function DespedidasMadrid() {
  const [pedir, setPedir] = useState<string | null>(null);

  const abrir = (servicio: string) => {
    track('despedidas_pedir_abre', { servicio });
    setPedir(servicio);
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Despedida en Madrid: pídelo todo en un sitio | XPEAK" />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
      </Helmet>

      <div className="min-h-screen" style={{ background: '#FFFDF7', color: '#111' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#8B6A00' }}>XPEAK</a>
          <a href="/blog" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#374151' }}>Blog</a>
        </nav>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10 sm:pb-14">
          <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-3" style={{ color: '#8B6A00' }}>Despedidas en Madrid</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ lineHeight: 1.1 }}>
            Tu despedida, sin montar el plan a trozos
          </h1>
          <p className="mt-4 text-base sm:text-lg max-w-2xl" style={{ color: '#374151' }}>
            DJ, catering, camareros, sonido y fotos para tu despedida de soltera o de soltero, pedidos desde un mismo sitio. Tú pones la fecha y lo que necesitas; los profesionales de Madrid te contestan.
          </p>
          <button type="button" onClick={() => abrir('DJ')}
            className="mt-7 px-6 py-3 rounded-xl text-sm sm:text-base font-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Pedir para mi fecha
          </button>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">Qué puedes pedir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICIOS.map(s => (
              <button key={s.servicio} type="button" onClick={() => abrir(s.servicio)}
                className="text-left rounded-2xl p-5 transition-all hover:scale-[1.02]"
                style={{ background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.35)' }}>
                <p className="text-base font-black" style={{ color: '#8B6A00' }}>{s.t}</p>
                <p className="mt-1.5 text-sm" style={{ color: '#374151' }}>{s.d}</p>
                <p className="mt-3 text-xs font-bold" style={{ color: '#8B6A00' }}>Pedir para mi fecha</p>
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm" style={{ color: '#4B5563' }}>
            ¿Necesitas transporte para el grupo, como un bus o una furgoneta? Cuéntalo en las notas de la solicitud y lo tenemos en cuenta.
          </p>
          <p className="mt-3 text-sm" style={{ color: '#4B5563' }}>
            ¿Quieres hacerte una idea del coste antes de pedir? Mira la <a href="/blog/despedida-de-soltera-madrid-cuanto-cuesta" className="underline" style={{ color: '#8B6A00' }}>guía de precios de una despedida en Madrid</a>.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">Cómo funciona</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PASOS.map((p, i) => (
              <li key={p.t} className="rounded-2xl p-5" style={{ background: '#FBF3DD' }}>
                <p className="text-sm font-black" style={{ color: '#8B6A00' }}>Paso {i + 1}</p>
                <p className="mt-1 text-base font-black">{p.t}</p>
                <p className="mt-1.5 text-sm" style={{ color: '#374151' }}>{p.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <FooterPublic />
      </div>

      {pedir && (
        <Suspense fallback={null}>
          <ParticularRequestModal
            onClose={() => setPedir(null)}
            onEnviado={() => track('despedidas_pedir_enviada', { servicio: pedir })}
            inicial={{ service: pedir, location: 'Madrid', eventType: 'Despedida' }}
          />
        </Suspense>
      )}
    </>
  );
}
