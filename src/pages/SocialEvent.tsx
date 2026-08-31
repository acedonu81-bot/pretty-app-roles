import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toSlug } from '@/data/profiles';
import FooterPublic from '@/components/FooterPublic';

interface DanceSocial {
  id: string;
  event_name: string;
  style: string;
  city: string;
  venue: string | null;
  event_date: string;
  description: string | null;
  link_url: string | null;
  user_id: string;
  organizer_name: string | null;
}

const BASE_URL = 'https://xpeak.es';

// Durante el prerender de build (prerender-content.mjs), esta variable trae
// el evento ya resuelto — igual patrón que __PRERENDER_PROFILES__ en
// CityLanding.tsx: renderToString no espera al useEffect de abajo, así que
// sin esto el HTML servido a crawlers nunca tiene el evento real.
declare global {
  // eslint-disable-next-line no-var
  var __PRERENDER_SOCIAL_EVENT__: DanceSocial | null | undefined;
}

function formatDateLong(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function SocialEvent() {
  const { slug } = useParams<{ slug: string }>();
  const preloaded = typeof globalThis !== 'undefined' ? globalThis.__PRERENDER_SOCIAL_EVENT__ : undefined;
  const [event, setEvent] = useState<DanceSocial | null>(preloaded ?? null);
  const [loading, setLoading] = useState(preloaded === undefined);

  useEffect(() => {
    if (preloaded !== undefined) return;
    if (!slug) { setLoading(false); return; }
    supabase
      .from('dance_socials' as any)
      .select('id, event_name, style, city, venue, event_date, description, link_url, user_id')
      .gte('event_date', new Date().toISOString().slice(0, 10))
      .then(async ({ data }) => {
        const rows = (data ?? []) as unknown as Omit<DanceSocial, 'organizer_name'>[];
        const match = rows.find(e => `${toSlug(e.event_name)}-${e.id.slice(0, 8)}` === slug);
        if (!match) { setEvent(null); setLoading(false); return; }
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', match.user_id)
          .maybeSingle();
        setEvent({ ...match, organizer_name: profile?.display_name ?? null });
        setLoading(false);
      });
  }, [slug]);

  if (loading) return null;
  if (!event) {
    return (
      <>
        <Helmet><meta name="robots" content="noindex, follow" /></Helmet>
        <Navigate to="/socials" replace />
      </>
    );
  }

  const url = `${BASE_URL}/socials/${slug}`;
  const title = `${event.event_name} — ${event.style} en ${event.city} | XPEAK`;
  const desc = event.description?.trim()
    ? `${event.description.trim().slice(0, 150)}${event.description.length > 150 ? '…' : ''} ${formatDateLong(event.event_date)} en ${event.venue ? `${event.venue}, ` : ''}${event.city}.`
    : `${event.style} en ${event.venue ? `${event.venue}, ` : ''}${event.city}, el ${formatDateLong(event.event_date)}. Agenda de socials de baile en XPEAK.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.event_name,
    startDate: event.event_date,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.venue || event.city,
      address: { '@type': 'PostalAddress', addressLocality: event.city, addressCountry: 'ES' },
    },
    description: desc,
    url,
    ...(event.organizer_name ? { organizer: { '@type': 'Person', name: event.organizer_name } } : {}),
  };

  const organizerSlug = event.organizer_name ? toSlug(event.organizer_name) : null;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="event" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#222' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-3xl mx-auto" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#1a1208' }}>X<span style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span></a>
          <Link to="/socials" className="text-xs font-semibold" style={{ color: '#444' }}>← Ver toda la agenda</Link>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7a6216' }}>
            {event.style} · Agenda XPEAK
          </p>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4" style={{ color: '#111' }}>
            {event.event_name}
          </h1>

          <div className="flex flex-col gap-2 mb-6 text-sm" style={{ color: '#333' }}>
            <p className="flex items-center gap-2"><Calendar size={15} style={{ color: '#8A6D0F' }} /> {formatDateLong(event.event_date)}</p>
            <p className="flex items-center gap-2"><MapPin size={15} style={{ color: '#8A6D0F' }} /> {event.venue ? `${event.venue}, ` : ''}{event.city}</p>
          </div>

          {event.description && (
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#333' }}>{event.description}</p>
          )}

          {event.link_url && (
            <a href={event.link_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold mb-8 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Más información <ExternalLink size={14} />
            </a>
          )}

          <div className="rounded-xl p-4 sm:p-5 mb-8" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm" style={{ color: '#444' }}>
              {event.organizer_name && organizerSlug ? (
                <>Organizado por <Link to={`/p/${organizerSlug}`} className="font-bold underline" style={{ color: '#8A6D0F' }}>{event.organizer_name}</Link>. </>
              ) : null}
              Descubre más eventos de {event.style.toLowerCase()} en{' '}
              <Link to="/socials" className="font-bold underline" style={{ color: '#8A6D0F' }}>la agenda de XPEAK</Link>
              {' '}o encuentra <Link to="/directorio/bailarin" className="font-bold underline" style={{ color: '#8A6D0F' }}>bailarines y profesores</Link> para tu próximo evento.
            </p>
          </div>
        </main>

        <FooterPublic />
      </div>
    </>
  );
}
