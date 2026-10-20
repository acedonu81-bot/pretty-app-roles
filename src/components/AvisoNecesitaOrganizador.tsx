import { useNavigate } from 'react-router-dom';

/**
 * Se enseña en lugar del formulario cuando alguien con cuenta de profesional
 * (o sin rol elegido) intenta pedir un profesional. Sin perfil de organizador
 * no se manda nada: antes cualquiera "probaba" y avisaba a profesionales reales.
 */
export default function AvisoNecesitaOrganizador({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="p-5 text-center">
      <p className="text-base font-black mb-2" style={{ color: '#111' }}>Para pedir un profesional necesitas un perfil de organizador</p>
      <p className="text-sm mb-4" style={{ color: '#333' }}>
        Tu cuenta es de profesional. Añade un perfil de <strong>Empresa / Sala</strong> en Ajustes (tienes los dos a la vez, el tuyo y el de organizador) y podrás pedir DJs, camareros y más. Así los profesionales saben que la solicitud es real.
      </p>
      <button type="button" onClick={() => { onClose(); navigate('/dashboard?view=settings'); }}
        className="inline-block px-6 py-2.5 rounded-xl text-sm font-black"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
        Crear mi perfil de organizador
      </button>
    </div>
  );
}
