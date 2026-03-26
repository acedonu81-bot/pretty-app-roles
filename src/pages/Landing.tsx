import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, UserCheck, Smile, Briefcase } from 'lucide-react';
import xpeakLogo from '@/assets/xpeak-logo.png';
import AmbientBackground from '@/components/AmbientBackground';
import HeroMockup from '@/components/HeroMockup';
import RoleCard from '@/components/RoleCard';
import LegalFooter from '@/components/LegalFooter';
import DemoVideoModal from '@/components/DemoVideoModal';

const Landing = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col" style={{ background: '#000' }}>
      <AmbientBackground />

      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={xpeakLogo} alt="XPEAK" width={36} height={36} />
            <h1 className="text-2xl font-bold tracking-wider">
              X<span className="text-gradient">PEAK</span>
            </h1>
          </div>
        </div>
      </nav>

      <header className="max-w-[1200px] mx-auto px-6 md:px-8 flex items-center min-h-[75vh] gap-12 pt-12 pb-12 flex-col lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Directorio Profesional en{' '}
            <span className="text-gradient">Gestión de Eventos</span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            Conecta con DJs, Personal de Sala, Maquillaje y Peluquería, Vestuario y Moda, Fotógrafos, Videógrafos, Diseñadores, Promotores y Empresarios. Encuentra talento o publica ofertas en tiempo real.
          </p>
          <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
            <button onClick={() => navigate('/auth')} className="btn-nightlife-primary text-base px-8 py-4">
              Unirse al Directorio
            </button>
            <button onClick={() => setDemoOpen(true)} className="btn-nightlife-secondary text-base px-8 py-4">
              Ver Demo
            </button>
          </div>
        </div>
        <div className="flex-1 hidden lg:block" style={{ perspective: 1000 }}>
          <HeroMockup />
        </div>
      </header>


      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 flex-1">
        <h3 className="text-center text-3xl lg:text-4xl font-bold mb-12">
          ¿Cuál es tu rol en el escenario?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <RoleCard icon={<Headphones size={24} />} title="DJ Profesional" description="Gestiona tu caché, pincha en el Escenario Virtual y conecta en directo con empresarios." role="dj" />
          <RoleCard icon={<UserCheck size={24} />} title="Personal de Sala" description="Camareros, jefes de sala y hostess. Publica tu perfil y recibe ofertas al instante." role="staff" />
          <RoleCard icon={<Smile size={24} />} title="Estilismo & Makeup" description="Maquilladores, estilistas y artistas corporales. Muestra tu portfolio y encuentra eventos." role="makeup" />
          <RoleCard icon={<Briefcase size={24} />} title="Empresarios" description="Publica ofertas urgentes en Flash Booking, contrata talento y gestiona tu equipo de noche." role="promotor" />
        </div>
      </section>

      <LegalFooter />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default Landing;
