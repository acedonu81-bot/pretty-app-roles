import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, MapPin } from 'lucide-react';
import LegalModal from './LegalModal';
import ContactModal from './ContactModal';

const LegalFooter = () => {
  const [showLegal, setShowLegal] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer
        className="w-full px-6 md:px-10 pt-16 pb-8 mt-auto"
        style={{ borderTop: '1px solid rgba(212,175,55,0.12)', background: '#FBF6E8' }}
      >
        <div className="max-w-[1800px] mx-auto">

          {/* Top — logo + columnas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12" style={{ borderBottom: '1px solid rgba(122,98,22,0.16)' }}>

            {/* Marca */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl font-black tracking-tight font-display" style={{ color: '#8B6A00' }}>X<span style={{ color: '#111' }}>PEAK</span></span>
              </div>
              <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: '#4b5563' }}>
                Conectamos profesionales de eventos con quienes los necesitan. España.
              </p>
              <a href="mailto:info@xpeak.es" className="inline-block mt-3 text-xs font-bold transition-colors hover:opacity-80"
                style={{ color: '#8B6A00' }}>
                info@xpeak.es
              </a>
            </div>

            {/* Plataforma */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-4" style={{ color: '#4b5563' }}>Plataforma</p>
              <ul className="space-y-2.5 text-xs" style={{ color: '#374151' }}>
                <li><Link to="/directorio/dj" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Ver profesionales</Link></li>
                <li><Link to="/auth?mode=register&role=profesional" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Publicar mi perfil</Link></li>
                <li><Link to="/dashboard" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Mi dashboard</Link></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-4" style={{ color: '#4b5563' }}>Empresa</p>
              <ul className="space-y-2.5 text-xs" style={{ color: '#374151' }}>
                <li><Link to="/sobre-nosotros" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Sobre nosotros</Link></li>
                <li>
                  <button onClick={() => setShowContact(true)} className="inline-block py-1 hover:text-[#8B6A00] transition-colors text-left">
                    Contacto
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowLegal(true)} className="inline-block py-1 hover:text-[#8B6A00] transition-colors text-left">
                    Aviso de intermediación
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-4" style={{ color: '#4b5563' }}>Legal</p>
              <ul className="space-y-2.5 text-xs" style={{ color: '#374151' }}>
                <li><Link to="/privacidad" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Política de privacidad</Link></li>
                <li><Link to="/terminos" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Términos y condiciones</Link></li>
                <li><Link to="/cookies" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Política de cookies</Link></li>
                <li><Link to="/aviso-legal" className="inline-block py-1 hover:text-[#8B6A00] transition-colors">Aviso legal</Link></li>
              </ul>
            </div>
          </div>

          {/* Sellos de confianza — solo afirmaciones verificables (HTTPS real,
              región de hosting real de Vercel/Supabase), nada que suene a
              certificación de un tercero que no la ha emitido. */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 pb-2">
            <span className="flex items-center gap-1.5 text-[0.65rem]" style={{ color: '#4b5563' }}>
              <Lock size={11} /> Conexión segura SSL
            </span>
            <span className="flex items-center gap-1.5 text-[0.65rem]" style={{ color: '#4b5563' }}>
              <MapPin size={11} /> Datos alojados en la UE
            </span>
            <span className="flex items-center gap-1.5 text-[0.65rem]" style={{ color: '#4b5563' }}>
              <ShieldCheck size={11} /> Cumplimiento RGPD
            </span>
          </div>

          {/* Bottom */}
          <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(122,98,22,0.16)' }}>
            <p className="text-[0.7rem]" style={{ color: '#374151' }}>
              © {new Date().getFullYear()} XPEAK: España. Todos los derechos reservados.
            </p>
            <p className="text-[0.65rem] text-center max-w-md" style={{ color: '#374151' }}>
              Plataforma de intermediación técnica. Cada usuario actúa bajo su propia responsabilidad legal.
            </p>
          </div>

        </div>
      </footer>

      <LegalModal open={showLegal} onClose={() => setShowLegal(false)} />
      <ContactModal open={showContact} onClose={() => setShowContact(false)} />
    </>
  );
};

export default LegalFooter;
