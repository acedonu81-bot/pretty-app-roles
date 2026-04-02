import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Instagram, ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import { profiles, getWhatsAppLink, getInstagramLink } from '@/data/profiles';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';

const WA_MSG = encodeURIComponent('Hola, te he visto en XPEAK y me interesa tu perfil para un evento. ¿Hablamos?');

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profile = profiles.find(p => p.id === Number(id));

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#090909' }}>
        <p className="text-white/50">Perfil no encontrado</p>
        <button onClick={() => navigate('/')} className="text-sm font-bold" style={{ color: '#D4AF37' }}>
          ← Volver a XPEAK
        </button>
      </div>
    );
  }

  const roleLabel: Record<string, string> = {
    dj: 'DJ Profesional', staff: 'Staff & Promoción', makeup: 'Belleza & Estética',
    media: 'Imagen & Media', design: 'Diseño & Visuales', promotor: 'Promotor', ambassador: 'Embajador',
  };

  return (
    <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
      {/* SEO meta — injected via document for SPA */}
      {(() => {
        document.title = `${profile.name} — ${profile.specialty} | XPEAK`;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
        meta.setAttribute('content', `${profile.name} — ${profile.specialty} en ${profile.zone}. ${profile.description} Contacta en XPEAK.`);
        return null;
      })()}

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(9,9,9,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-80"
          style={{ color: 'rgba(255,255,255,0.5)' }}>
          <ArrowLeft size={16} /> XPEAK
        </button>
        <button onClick={() => navigate('/auth')}
          className="text-xs font-bold px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
          Unirse a XPEAK
        </button>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-8">
          <GeometricAvatar role={profile.role as any} seed={profile.id} size={80} isLive={profile.isLive} />
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.isPremium && (
                <span className="text-[0.55rem] font-black px-2 py-0.5 rounded-md"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>ELITE</span>
              )}
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#D4AF37' }}>{roleLabel[profile.role] ?? profile.role}</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{profile.specialty}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Valoración', value: profile.rating.toFixed(1) },
            { label: 'Reseñas', value: profile.reviews },
            { label: 'Experiencia', value: profile.experience },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl"
              style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <p className="text-lg font-black" style={{ color: '#D4AF37' }}>{s.value}</p>
              <p className="text-[0.6rem] text-white/40 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="glass-panel p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
          <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <MapPin size={12} /> {profile.zone}{profile.location ? `, ${profile.location}` : ''}
            <span className="mx-1">·</span>
            <Clock size={12} /> {profile.experience}
            {profile.isFlashActive && (
              <><span className="mx-1">·</span>
              <Zap size={12} style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e' }}>Disponible ahora</span></>
            )}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{profile.description}</p>
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {profile.badges.map(b => (
              <span key={b} className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
                {b}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a href={`https://wa.me/${profile.phone}?text=${WA_MSG}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(90deg,#25D366,#128C7E)', color: '#fff' }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar por WhatsApp
          </a>
          <a href={getInstagramLink(profile.instagram)} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            <Instagram size={16} /> Ver Instagram
          </a>
        </div>

        {/* XPEAK CTA */}
        <div className="mt-8 p-5 rounded-2xl text-center"
          style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D4AF37' }}>XPEAK · Directorio Profesional Europa</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Descubre cientos de profesionales verificados del sector nocturno en toda Europa.
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={() => navigate('/auth')}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              Crear perfil gratis →
            </button>
            <button onClick={() => navigate('/auth')}
              className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ya tengo cuenta · Acceder
            </button>
          </div>
        </div>

        {/* Otros perfiles del mismo rol */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Más {roleLabel[profile.role] ?? profile.role}s en XPEAK
          </p>
          <div className="flex flex-col gap-2">
            {profiles.filter(p => p.role === profile.role && p.id !== profile.id).slice(0, 3).map(p => (
              <button key={p.id} onClick={() => navigate(`/p/${p.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <GeometricAvatar role={p.role as any} seed={p.id} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.specialty} · {p.zone}</p>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#D4AF37' }}>
                  <Star size={10} fill="#D4AF37" /> {p.rating}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
