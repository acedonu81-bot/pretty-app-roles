import { useState } from 'react';
import { Shield } from 'lucide-react';
import LegalModal from './LegalModal';

const LegalFooter = () => {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <>
      <footer
        className="w-full px-4 md:px-6 py-4 text-center text-[0.6rem] leading-relaxed text-muted-foreground"
        style={{ borderTop: '1px solid var(--nightlife-border)', background: 'rgba(0,0,0,0.5)' }}
      >
        <p className="mb-1.5 font-bold uppercase tracking-widest text-[0.55rem]" style={{ color: '#D4AF37' }}>
          Aviso Legal
        </p>
        <p className="max-w-3xl mx-auto">
          Esta plataforma es un servicio de intermediación técnica (directorio). El titular de la app no es responsable de la veracidad de los perfiles, ni de su situación fiscal o laboral (autónomos, seguros, etc.). Cada usuario declara actuar bajo su propia responsabilidad legal. No gestionamos pagos ni contratos.
        </p>
        <p className="mt-1.5 max-w-3xl mx-auto opacity-60">
          XPEAK es un tablón de anuncios. No intervenimos en la contratación ni verificamos la situación legal de los usuarios. XPEAK no cobra comisiones por contrato, solo por suscripción/pases. La relación contractual es exclusiva entre las partes.
        </p>
        <button
          onClick={() => setShowLegal(true)}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all hover:scale-105"
          style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <Shield size={10} />
          Aviso de Intermediación y Privacidad
        </button>
      </footer>
      <LegalModal open={showLegal} onClose={() => setShowLegal(false)} />
    </>
  );
};

export default LegalFooter;
