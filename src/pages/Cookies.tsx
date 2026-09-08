import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#0A0A0A' }}>
      <Helmet>
        <title>Política de Cookies | XPEAK</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <AmbientBackground />

      <div className="flex-1 z-10 max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-block mb-6 text-xs font-bold transition-colors" style={{ color: '#D4AF37' }}>
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          Política de <span className="text-gradient">Cookies</span>
        </h1>
        <p className="text-xs mb-8" style={{ color: "#333" }}>Última actualización: 9 de septiembre de 2026</p>

        <div className="glass-panel p-6 md:p-8 space-y-6 text-sm leading-relaxed" style={{ color: 'rgba(22,20,18,0.78)' }}>
          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>1. ¿Qué son las Cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un periodo de tiempo.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>2. Cookies que Utilizamos</h2>
            <p className="mb-3">XPEAK utiliza dos tipos de cookies: <strong style={{ color: "#111" }}>técnicas</strong> (necesarias, no requieren consentimiento) y <strong style={{ color: "#111" }}>opcionales</strong> (analítica, marketing y personalización, requieren tu consentimiento previo mediante el banner de cookies).</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs mt-2" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: '#D4AF37' }}>Cookie</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: '#D4AF37' }}>Tipo</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: '#D4AF37' }}>Finalidad</th>
                    <th className="text-left py-2 px-3 font-bold" style={{ color: '#D4AF37' }}>Duración</th>
                  </tr>
                </thead>
                <tbody style={{ color: "#222" }}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-2 px-3 text-foreground font-medium">sb-*-auth-token</td>
                    <td className="py-2 px-3"><span className="text-green-400 font-bold">Técnica</span></td>
                    <td className="py-2 px-3">Mantener la sesión del usuario autenticado</td>
                    <td className="py-2 px-3">7 días</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-2 px-3 text-foreground font-medium">xpeak-cookie-consent</td>
                    <td className="py-2 px-3"><span className="text-green-400 font-bold">Técnica</span></td>
                    <td className="py-2 px-3">Recordar tus preferencias de cookies (necesarias, analítica, marketing, personalización)</td>
                    <td className="py-2 px-3">Sin caducidad (hasta que borres los datos del navegador)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-2 px-3 text-foreground font-medium">_ga, _ga_*</td>
                    <td className="py-2 px-3"><span style={{ color: '#D4AF37' }} className="font-bold">Opcional (Analítica)</span></td>
                    <td className="py-2 px-3">Google Analytics 4, vía Google Tag Manager: páginas vistas, sesiones y origen del tráfico</td>
                    <td className="py-2 px-3">Hasta 13 meses</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-2 px-3 text-foreground font-medium">_fbp, fr</td>
                    <td className="py-2 px-3"><span style={{ color: '#D4AF37' }} className="font-bold">Opcional (Marketing)</span></td>
                    <td className="py-2 px-3">Meta Pixel (Facebook/Instagram): mide conversiones de nuestras campañas de publicidad</td>
                    <td className="py-2 px-3">Hasta 90 días</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: "#222" }}>
              Las cookies opcionales solo se activan si otorgas consentimiento explícito mediante el banner de cookies. Puedes revocar tu consentimiento en cualquier momento borrando los datos del sitio en tu navegador, lo que hará que el banner vuelva a aparecer.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>3. Cookies de Terceros</h2>
            <p className="mb-2"><strong style={{ color: "#111" }}>Google Tag Manager / Google Analytics 4 (Google Ireland Ltd.):</strong> analítica de uso de la plataforma. Solo se activa si aceptas la categoría "Analítica" del banner de cookies.</p>
            <p><strong style={{ color: "#111" }}>Meta Pixel (Meta Platforms Ireland Ltd.):</strong> mide conversiones de nuestras campañas publicitarias en Instagram/Facebook. Solo se activa si aceptas la categoría "Marketing" del banner de cookies. Puedes consultar la política de cookies de Meta en su sitio web oficial.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>4. ¿Cómo Gestionar las Cookies?</h2>
            <p className="mb-2">Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Ten en cuenta que si desactivas las cookies técnicas, es posible que algunas funcionalidades no funcionen correctamente (como mantener tu sesión iniciada).</p>
            <ul className="list-disc list-inside space-y-1" style={{ color: "#222" }}>
              <li><strong style={{ color: "#111" }}>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
              <li><strong style={{ color: "#111" }}>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
              <li><strong style={{ color: "#111" }}>Safari:</strong> Preferencias → Privacidad → Cookies</li>
              <li><strong style={{ color: "#111" }}>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>5. Base Legal</h2>
            <p>El uso de cookies técnicas estrictamente necesarias se ampara en el <strong style={{ color: "#111" }}>interés legítimo</strong> del responsable del tratamiento (art. 22.2 LSSI-CE y RGPD). El uso de cookies opcionales de analítica y personalización se basa en el <strong style={{ color: "#111" }}>consentimiento explícito</strong> del usuario (art. 6.1.a RGPD), que puede revocarse en todo momento sin perjuicio para la licitud del tratamiento previo.</p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-2" style={{ color: '#D4AF37' }}>6. Contacto</h2>
            <p>Si tienes dudas sobre nuestra política de cookies, contacta con nosotros en: <span style={{ color: '#D4AF37' }}>info@xpeak.es</span></p>
          </section>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Cookies;
