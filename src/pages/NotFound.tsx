import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const isProfile = location.pathname.startsWith("/p/");

  const CATEGORIES = [
    { label: "DJ", to: "/contratar-dj" },
    { label: "Catering", to: "/contratar-catering" },
    { label: "Fotógrafos", to: "/contratar-fotografo" },
    { label: "Camareros", to: "/contratar-camareros" },
    { label: "Maquillaje", to: "/contratar-maquillaje" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#000' }}>
      <Helmet>
        <title>{isProfile ? "Perfil no encontrado | XPEAK" : "Página no encontrada | XPEAK"}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="text-center px-6 max-w-sm">
        <p className="text-7xl font-black mb-4" style={{ color: '#D4AF37' }}>404</p>
        <h1 className="text-xl font-bold text-white mb-2">
          {isProfile ? "Perfil no encontrado" : "Página no encontrada"}
        </h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {isProfile
            ? "Este perfil no existe o ha sido eliminado. Puede que el profesional haya cambiado su URL."
            : "La página que buscas no existe o ha sido movida."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: '#D4AF37', color: '#000' }}
          >
            <Home size={15} />
            Ir al inicio
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Search size={15} />
            Buscar profesionales
          </Link>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          O explora por categoría
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
