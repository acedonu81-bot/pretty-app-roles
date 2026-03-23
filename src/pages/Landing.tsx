import { useNavigate } from 'react-router-dom';
import { Headphones, Star, Speaker, Truck, CalendarDays } from 'lucide-react';
import AmbientBackground from '@/components/AmbientBackground';
import HeroMockup from '@/components/HeroMockup';
import RoleCard from '@/components/RoleCard';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--nightlife-bg)' }}>
      <AmbientBackground />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-[1200px] mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wider">
            NIGHT<span className="text-gradient">LIFE</span>
          </h1>
          <button onClick={() => navigate('/auth')} className="btn-nightlife-primary text-sm">
            Entrar al Portal
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-8 flex items-center min-h-[80vh] gap-16 pt-16 pb-16 flex-col lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            El Ecosistema Completo del{' '}
            <span className="text-gradient">Ocio Nocturno</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
            Conecta al instante con DJs, Promotores, Agencias, Proveedores de Equipo y Transportistas Profesionales. Todo en una plataforma ultratecnológica diseñada para la industria de eventos.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
            <button onClick={() => navigate('/auth')} className="btn-nightlife-primary text-lg px-10 py-4">
              Unirse a la Red
            </button>
            <button className="btn-nightlife-secondary text-lg px-10 py-4">
              Ver Demo
            </button>
          </div>
        </div>
        <div className="flex-1 hidden lg:block" style={{ perspective: 1000 }}>
          <HeroMockup />
        </div>
      </header>

      {/* Roles Section */}
      <section className="max-w-[1200px] mx-auto px-8 py-24">
        <h3 className="text-center text-4xl lg:text-5xl font-extrabold mb-16">
          ¿Cuál es tu rol en el escenario?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RoleCard
            icon={<Headphones size={30} />}
            title="DJ Profesional"
            description="Gestiona tu caché, agenda fechas en tiempo real y haz matching con las mejores salas y festivales."
            role="dj"
          />
          <RoleCard
            icon={<Star size={30} />}
            title="Empresas Promotoras"
            description="Contrata talento, coordina recursos y visualiza proyecciones de rentabilidad mediante herramientas avanzadas."
            role="promotor"
          />
          <RoleCard
            icon={<Speaker size={30} />}
            title="Alquiler de Equipos"
            description="Publica cabinas enteras, sonido o iluminación. Recibe reservas de material verificado y con garantías."
            role="equipment"
          />
          <RoleCard
            icon={<Truck size={30} />}
            title="Transportistas"
            description="Conductores y flotas capacitadas para carga audiovisual. Organiza rutas y asegúrate los portes ideales."
            role="transport"
          />
          <RoleCard
            icon={<CalendarDays size={30} />}
            title="Agencias de Marketing"
            description="Ofrece personal de imagen, azafatas, fotógrafos y promoción integral con nuestra base de datos segmentada."
            role="agency"
          />
        </div>
      </section>
    </div>
  );
};

export default Landing;
