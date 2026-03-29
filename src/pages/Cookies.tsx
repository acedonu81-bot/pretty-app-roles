import { Link } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#0A0A0A' }}>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-block mb-6 text-xs font-bold transition-colors" style={{ color: '#D4AF37' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          🍪 Política de <span className="text-gradient">Cookies</span>
        </h1>
        <p className="text-xs text-muted-foreground mb-8">Fecha de entrada en vigor: 25 de marzo de 2026</p>

        <div className="glass-panel p-6 md:p-8 space-y-6 text-sm leading-relaxed" style={{ color: '#ccc' }}>
          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>1. ¿Qué son las Cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil) cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un periodo de tiempo.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>2. Cookies que Utilizamos</h2>
            <p className="mb-2">XPEAK utiliza exclusivamente <strong className="text-foreground">cookies técnicas y de sesión</strong>, estrictamente necesarias para el funcionamiento de la plataforma:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs mt-2" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: '#D4AF37' }}>Cookie</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: '#D4AF37' }}>Finalidad</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: '#D4AF37' }}>Duración</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-2 px-3 text-foreground font-medium">sb-*-auth-token</td>
                    <td className="py-2 px-3">Mantener la sesión del usuario autenticado</td>
                    <td className="py-2 px-3">Sesión / 7 días</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-2 px-3 text-foreground font-medium">xpeak-cookies-accepted</td>
                    <td className="py-2 px-3">Recordar la aceptación de esta política de cookies</td>
                    <td className="py-2 px-3">365 días</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>3. Cookies de Terceros</h2>
            <p>Actualmente, XPEAK <strong className="text-foreground">no utiliza cookies de terceros</strong> con fines publicitarios ni de seguimiento. Los pagos se procesan a través de Stripe, que puede establecer sus propias cookies técnicas necesarias para la seguridad de las transacciones. Puedes consultar la política de cookies de Stripe en su sitio web oficial.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>4. ¿Cómo Gestionar las Cookies?</h2>
            <p className="mb-2">Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Ten en cuenta que si desactivas las cookies técnicas, es posible que algunas funcionalidades de la plataforma no funcionen correctamente (como mantener tu sesión iniciada).</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
              <li><strong className="text-foreground">Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
              <li><strong className="text-foreground">Safari:</strong> Preferencias → Privacidad → Cookies</li>
              <li><strong className="text-foreground">Edge:</strong> Configuración → Cookies y permisos del sitio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>5. Base Legal</h2>
            <p>El uso de cookies técnicas estrictamente necesarias se ampara en el interés legítimo del responsable del tratamiento para garantizar el correcto funcionamiento del servicio, de conformidad con el artículo 22.2 de la Ley 34/2002 (LSSI-CE) y el Reglamento General de Protección de Datos (RGPD).</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>6. Contacto</h2>
            <p>Si tienes dudas sobre nuestra política de cookies, contacta con nosotros en: <span style={{ color: '#D4AF37' }}>admin@xpeak.es</span></p>
          </section>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Cookies;
