import { createPortal } from 'react-dom';
import { Shield, X } from 'lucide-react';

const legalText = `AVISO DE INTERMEDIACIÓN Y PROTECCIÓN DE DATOS – XPEAK

Naturaleza del Servicio: XPEAK actúa exclusivamente como un directorio profesional y plataforma de intermediación tecnológica. La plataforma facilita el contacto entre profesionales independientes y empresas u organizadores de eventos.

Ausencia de Relación Laboral: XPEAK no es una agencia de contratación ni una empresa de trabajo temporal. No existe relación laboral, de dependencia o de subordinación entre XPEAK y los profesionales inscritos en el directorio.

Responsabilidad de Contratación: Cualquier acuerdo, contrato o pago derivado del contacto realizado a través de esta web es responsabilidad exclusiva de las partes interesadas. XPEAK no interviene en las negociaciones ni garantiza la ejecución del servicio.

Protección de Datos (RGPD): Al pulsar "Contactar", el usuario acepta que sus datos de perfil sean compartidos con el interesado únicamente para fines profesionales. El responsable del tratamiento es XPEAK y el contacto para el ejercicio de derechos (acceso, rectificación, supresión) es info@xpeak.site.

Normas de la Comunidad: Los usuarios se comprometen a utilizar la plataforma de forma ética y profesional. XPEAK se reserva el derecho de eliminar perfiles que incumplan estas normas o generen reportes negativos.`;

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

const LegalModal = ({ open, onClose, onAccept }: LegalModalProps) => {
  if (!open) return null;

  const handleAccept = () => {
    onAccept?.();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-panel p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} style={{ color: '#D4AF37' }} />
            <h3 className="text-sm font-bold">Aviso de Intermediación y Protección de Datos</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
          {legalText}
        </div>
        <div className="mt-4 p-3 rounded-lg text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-xs text-muted-foreground">Para ejercer tus derechos contacta con:</p>
          <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>info@xpeak.site</p>
        </div>
        <button onClick={handleAccept}
          className="mt-4 w-full py-2.5 rounded-lg font-bold text-xs"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          Entendido
        </button>
      </div>
    </div>,
    document.body
  );
};

export default LegalModal;
