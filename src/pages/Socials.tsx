import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, ExternalLink, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
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
}

const STYLES = ['Salsa', 'Bachata', 'Kizomba', 'Zouk', 'Mixto'];
const BASE_URL = 'https://xpeak.es';

const Socials = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<DanceSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ event_name: '', style: 'Salsa', city: '', venue: '', event_date: '', description: '', link_url: '' });

  useEffect(() => {
    supabase
      .from('dance_socials' as any)
      .select('id, event_name, style, city, venue, event_date, description, link_url')
      .gte('event_date', new Date().toISOString().slice(0, 10))
      .order('event_date', { ascending: true })
      .limit(200)
      .then(({ data }) => {
        setEvents((data ?? []) as unknown as DanceSocial[]);
        setLoading(false);
      });
  }, []);

  const cities = useMemo(() => Array.from(new Set(events.map(e => e.city))).sort(), [events]);

  const filtered = events.filter(e =>
    (!cityFilter || e.city === cityFilter) &&
    (!styleFilter || e.style === styleFilter)
  );

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.event_name.trim() || !form.city.trim() || !form.event_date) {
      toast.error('Rellena nombre, ciudad y fecha del evento.');
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from('dance_socials' as any)
      .insert({
        user_id: user.id,
        event_name: form.event_name.trim(),
        style: form.style,
        city: form.city.trim(),
        venue: form.venue.trim() || null,
        event_date: form.event_date,
        description: form.description.trim() || null,
        link_url: form.link_url.trim() || null,
      })
      .select('id, event_name, style, city, venue, event_date, description, link_url')
      .single();
    setSaving(false);
    if (error) { toast.error('Error al publicar: ' + error.message); return; }
    setEvents(prev => [...prev, data as unknown as DanceSocial].sort((a, b) => a.event_date.localeCompare(b.event_date)));
    setForm({ event_name: '', style: 'Salsa', city: '', venue: '', event_date: '', description: '', link_url: '' });
    setShowForm(false);
    toast.success('Evento publicado en la agenda.');
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filtered.slice(0, 30).map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Event',
        name: e.event_name,
        startDate: e.event_date,
        location: { '@type': 'Place', name: e.venue || e.city, address: e.city },
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Agenda de Socials de Baile — Salsa, Bachata y Kizomba | XPEAK</title>
        <meta name="description" content="Socials y congresos de salsa, bachata y kizomba en toda España. Encuentra dónde bailar esta semana o publica tu evento gratis." />
        <link rel="canonical" href={`${BASE_URL}/socials`} />
        <meta property="og:title" content="Agenda de Socials de Baile — XPEAK" />
        <meta property="og:description" content="Socials y congresos de salsa, bachata y kizomba en toda España." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/socials`} />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#ffffff', color: '#222' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#1a1208' }}>X<span style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PEAK</span></a>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs font-semibold hidden sm:flex items-center gap-1 transition-all hover:opacity-70" style={{ color: '#444' }}>← Inicio</a>
            <a href="/directorio/bailarin" className="text-xs font-bold hidden sm:block" style={{ color: '#444' }}>Bailarines</a>
            {user ? (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Plus size={14} /> Publicar evento
              </button>
            ) : (
              <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Publicar evento</a>
            )}
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7a6216' }}>Agenda · XPEAK</p>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3" style={{ color: '#111' }}>
              Socials y congresos de salsa, bachata y kizomba
            </h1>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#333' }}>
              Eventos publicados por bailarines y promotores de la comunidad. Filtra por ciudad y estilo, o publica el tuyo gratis.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6">
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs font-bold" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.12)', color: '#222' }}>
              <option value="">Todas las ciudades</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-1.5 flex-wrap">
              {STYLES.map(s => (
                <button key={s} onClick={() => setStyleFilter(styleFilter === s ? '' : s)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={styleFilter === s
                    ? { background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }
                    : { background: '#fff', color: '#222', border: '1px solid rgba(0,0,0,0.12)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          {loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Cargando agenda…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl p-10 flex flex-col items-center gap-3 text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <Calendar size={28} style={{ color: 'rgba(212,175,55,0.5)' }} />
              <p className="text-sm font-bold" style={{ color: '#222' }}>Sin eventos todavía</p>
              <p className="text-xs max-w-xs" style={{ color: '#666' }}>
                {cityFilter || styleFilter ? 'No hay eventos con esos filtros. Prueba a quitarlos.' : 'Sé el primero en publicar un social o congreso.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(e => (
                <div key={e.id} className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
                  style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div className="flex flex-col items-center justify-center rounded-lg px-3 py-2 flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.08)', minWidth: 72 }}>
                    <span className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: '#8A6D0F' }}>
                      {formatDate(e.event_date)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-sm font-bold" style={{ color: '#111' }}>{e.event_name}</h2>
                      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: '#8A6D0F' }}>{e.style}</span>
                    </div>
                    <p className="text-xs flex items-center gap-1" style={{ color: '#555' }}>
                      <MapPin size={11} /> {e.venue ? `${e.venue}, ` : ''}{e.city}
                    </p>
                    {e.description && <p className="text-xs mt-1.5 line-clamp-2" style={{ color: '#666' }}>{e.description}</p>}
                  </div>
                  {e.link_url && (
                    <a href={e.link_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg flex-shrink-0 transition-all hover:scale-105"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#222', border: '1px solid rgba(0,0,0,0.1)' }}>
                      Más info <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        <FooterPublic />

        {/* Modal publicar evento */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#fff' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black" style={{ color: '#111' }}>Publicar evento</h3>
                <button onClick={() => setShowForm(false)}><X size={18} style={{ color: '#666' }} /></button>
              </div>
              <div className="flex flex-col gap-3">
                <input placeholder="Nombre del evento" value={form.event_name}
                  onChange={e => setForm(f => ({ ...f, event_name: e.target.value }))}
                  className="nightlife-input text-sm" />
                <select value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))}
                  className="nightlife-input text-sm">
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input placeholder="Ciudad" value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="nightlife-input text-sm" />
                <input placeholder="Sala / dirección (opcional)" value={form.venue}
                  onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                  className="nightlife-input text-sm" />
                <input type="date" value={form.event_date}
                  onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                  className="nightlife-input text-sm" />
                <textarea placeholder="Descripción (opcional)" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="nightlife-input text-sm" rows={3} />
                <input placeholder="Enlace (Instagram, entradas...) (opcional)" value={form.link_url}
                  onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                  className="nightlife-input text-sm" />
                <button onClick={handleSubmit} disabled={saving}
                  className="mt-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  {saving ? 'Publicando…' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Socials;
