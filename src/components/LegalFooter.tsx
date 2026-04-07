import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Cookie, Mail } from 'lucide-react';
import LegalModal from './LegalModal';
import ContactModal from './ContactModal';

const LegalFooter = () => {
  const [showLegal, setShowLegal] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer
        className="w-full px-4 md:px-6 py-6 text-center text-[0.65rem] leading-relaxed text-muted-foreground"
        style={{ borderTop: '1px solid rgba(212,175,55,0.1)', background: 'rgba(0,0,0,0.6)' }}
      >
        <p className="mb-2 font-bold uppercase tracking-widest text-[0.6rem]" style={{ color: '#D4AF37' }}>
          Aviso Legal
        </p>
        <p className="max-w-3xl mx-auto">
          Esta plataforma es un servicio de intermediación técnica (directorio). Cada usuario declara actuar bajo su propia responsabilidad legal. XPEAK no cobra comisiones por contrato, solo por suscripción/pases.
        </p>

        {/* Legal links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link to="/privacidad" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Shield size={10} /> Política de Privacidad
          </Link>
          <Link to="/terminos" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            <FileText size={10} /> Términos y Condiciones
          </Link>
          <Link to="/cookies" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Cookie size={10} /> Política de Cookies
          </Link>
          <button onClick={() => setShowLegal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Shield size={10} /> Aviso de Intermediación
          </button>
          <button onClick={() => setShowContact(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Mail size={10} /> Contacto
          </button>
        </div>

        <p className="mt-4 text-[0.55rem] opacity-40">© {new Date().getFullYear()} XPEAK — España. Todos los derechos reservados.</p>
      </footer>
      <LegalModal open={showLegal} onClose={() => setShowLegal(false)} />
      <ContactModal open={showContact} onClose={() => setShowContact(false)} />
    </>
  );
};

export default LegalFooter;
