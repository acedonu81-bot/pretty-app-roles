import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, UserCheck, Smile, Briefcase, Flame, Star } from 'lucide-react';
import AmbientBackground from '@/components/AmbientBackground';
import HeroMockup from '@/components/HeroMockup';
import RoleCard from '@/components/RoleCard';
import LegalFooter from '@/components/LegalFooter';
import DemoVideoModal from '@/components/DemoVideoModal';
import { profiles } from '@/data/profiles';

const topProfiles = profiles.filter(p => p.topFinde);

const Landing = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col" style={{ background: 'var(--nightlife-bg)' }}>
      <AmbientBackground />

      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-[1200px] mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wider">
            NIGHT<span className="text-gradient">LIFE</span>
          </h1>
          <button onClick={() => navigate('/auth')} className="btn-nightlife-primary text-sm">
            Entrar al Directorio
          </button>
        </div>
      </nav>

      <header className="max-w-[1200px] mx-auto px-8 flex items-center min-h-[80vh] gap-16 pt-16 pb-16 flex-col lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Directorio Profesional del{' '}
            <span className="text-gradient">Ocio Nocturno</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
            Conecta con DJs, Personal de Sala, Estilistas y Empresarios. Encuentra talento o publica ofertas urgentes en tiempo real.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
            <button onClick={() => navigate('/auth')} className="btn-nightlife-primary text-lg px-10 py-5">
              Unirse al Directorio
            </button>
            <button onClick={() => setDemoOpen(true)} className="btn-nightlife-secondary text-lg px-10 py-5">
              Ver Demo
            </button>
          </div>
        </div>
        <div className="flex-1 hidden lg:block" style={{ perspective: 1000 }}>
          <HeroMockup />
        </div>
      </header>

      {/* TOP FINDE Banner */}
      {topProfiles.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-8 py-12 w-full">
          <div className="glass-panel p-8 rounded-2xl" style={{ border: '1px solid rgba(255,188,0,0.2)', background: 'rgba(255,188,0,0.03)' }}>
            <h3 className="text-2xl font-extrabold mb-2 flex items-center gap-3">
              <Flame size={24} style={{ color: '#ffbc00' }} />
              <span style={{ color: '#ffbc00' }}>DJs y Staff Recomendados para este Finde</span>
              <Star size={20} style={{ color: '#ffbc00' }} />
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Perfiles destacados con el sello TOP FINDE — los más solicitados esta semana.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topProfiles.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  style={{ background: 'rgba(255,188,0,0.06)', border: '1px solid rgba(255,188,0,0.15)' }}
                  onClick={() => navigate('/dashboard')}>
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: '2px solid #ffbc00' }}>
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">{p.name}</span>
                      <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #ffbc00, #ff8c00)', color: '#000' }}>
                        TOP FINDE
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.specialty} • {p.zone}</p>
                  </div>
                  <span className="text-sm font-extrabold" style={{ color: 'hsl(var(--accent))' }}>€{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-[1200px] mx-auto px-8 py-24 flex-1">
        <h3 className="text-center text-4xl lg:text-5xl font-extrabold mb-16">
          ¿Cuál es tu rol en el escenario?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoleCard icon={<Headphones size={30} />} title="DJ Profesional" description="Gestiona tu caché, pincha en el Escenario Virtual y conecta en directo con empresarios." role="dj" />
          <RoleCard icon={<UserCheck size={30} />} title="Personal de Sala" description="Camareros, jefes de sala y hostess. Publica tu perfil y recibe ofertas al instante." role="staff" />
          <RoleCard icon={<Smile size={30} />} title="Estilismo & Makeup" description="Maquilladores, estilistas y artistas corporales. Muestra tu portfolio y encuentra eventos." role="makeup" />
          <RoleCard icon={<Briefcase size={30} />} title="Empresarios" description="Publica ofertas urgentes en Last Call, contrata talento y gestiona tu equipo de noche." role="promotor" />
        </div>
      </section>

      <LegalFooter />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default Landing;
