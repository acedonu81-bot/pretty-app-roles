import { useState } from 'react';
import { Link } from 'react-router-dom';
import LegalModal from './LegalModal';
import ContactModal from './ContactModal';

const LegalFooter = () => {
  const [showLegal, setShowLegal] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer
        className="w-full px-6 md:px-10 pt-16 pb-8 mt-auto"
        style={{ borderTop: '1px solid rgba(212,175,55,0.12)', background: 'rgba(0,0,0,0.85)' }}
      >
        <div className="max-w-[1800px] mx-auto">

          {/* Top — logo + columnas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

            {/* Marca */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl font-black tracking-tight font-display" style={{ color: '#D4AF37' }}>X<span style={{ color: 'rgba(255,255,255,0.85)' }}>PEAK</span></span>
              </div>
              <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Conectamos profesionales de eventos con quienes los necesitan. España.
              </p>
              <a href="mailto:info@xpeak.es" className="inline-block mt-3 text-xs font-bold transition-colors hover:opacity-80"
                style={{ color: 'rgba(212,175,55,0.7)' }}>
                info@xpeak.es
              </a>
            </div>

            {/* Plataforma */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.58)' }}>Plataforma</p>
              <ul className="space-y-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <li><Link to="/auth" className="hover:text-white transition-colors">Registro gratuito</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Para profesionales</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Para organizadores de eventos</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Mi dashboard</Link></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.58)' }}>Empresa</p>
              <ul className="space-y-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <li><Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
                <li>
                  <button onClick={() => setShowContact(true)} className="hover:text-white transition-colors text-left">
                    Contacto
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowLegal(true)} className="hover:text-white transition-colors text-left">
                    Aviso de intermediación
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.58)' }}>Legal</p>
              <ul className="space-y-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <li><Link to="/privacidad" className="hover:text-white transition-colors">Política de privacidad</Link></li>
                <li><Link to="/terminos" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Política de cookies</Link></li>
                <li><Link to="/aviso-legal" className="hover:text-white transition-colors">Aviso legal</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[0.7rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              © {new Date().getFullYear()} XPEAK — España. Todos los derechos reservados.
            </p>
            <p className="text-[0.65rem] text-center max-w-md" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Plataforma de intermediación técnica. Cada usuario actúa bajo su propia responsabilidad legal. XPEAK no cobra comisiones por contrato.
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
