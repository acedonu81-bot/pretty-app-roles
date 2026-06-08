import { Helmet } from 'react-helmet-async';
import FooterPublic from '@/components/FooterPublic';

export default function EliminarCuenta() {
  return (
    <>
      <Helmet>
        <title>Eliminar cuenta | XPEAK</title>
        <meta name="description" content="Cómo solicitar la eliminación de tu cuenta y datos en XPEAK." />
        <link rel="canonical" href="https://xpeak.es/eliminar-cuenta" />
      </Helmet>

      <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F0' }}>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-black mb-6">Eliminación de cuenta y datos</h1>

          <p className="text-neutral-300 mb-8">
            En XPEAK respetamos tu derecho a controlar tus datos personales. Puedes solicitar la eliminación completa de tu cuenta y todos los datos asociados siguiendo los pasos indicados a continuación.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Opción 1 — Desde la app (recomendado)</h2>
              <ol className="list-decimal list-inside space-y-2 text-neutral-300">
                <li>Inicia sesión en XPEAK</li>
                <li>Ve a tu perfil → Ajustes</li>
                <li>Desplázate hasta "Zona de peligro"</li>
                <li>Pulsa "Eliminar mi cuenta"</li>
                <li>Confirma la eliminación introduciendo tu contraseña</li>
              </ol>
              <p className="text-neutral-400 text-sm mt-3">Tu cuenta y todos tus datos se eliminarán de forma permanente e inmediata.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Opción 2 — Por email</h2>
              <p className="text-neutral-300 mb-3">Envía un email a <a href="mailto:acedonu81@gmail.com" className="underline" style={{ color: '#D4AF37' }}>acedonu81@gmail.com</a> con el asunto <strong>"Solicitud eliminación de cuenta"</strong> e indica:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-300">
                <li>El email con el que estás registrado en XPEAK</li>
                <li>Si quieres eliminar solo algunos datos o la cuenta completa</li>
              </ul>
              <p className="text-neutral-400 text-sm mt-3">Procesamos las solicitudes en un plazo máximo de 30 días hábiles.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Datos que se eliminan</h2>
              <ul className="list-disc list-inside space-y-1 text-neutral-300">
                <li>Perfil público (nombre, foto, descripción, especialidad)</li>
                <li>Historial de mensajes y conversaciones</li>
                <li>Solicitudes de booking enviadas o recibidas</li>
                <li>Contratos generados</li>
                <li>Datos de registro (email, contraseña)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Datos que se conservan</h2>
              <p className="text-neutral-300">Por obligación legal, conservamos durante 5 años los registros de facturación y contratos firmados electrónicamente, conforme a la legislación española vigente.</p>
            </section>
          </div>

          <div className="mt-12 p-4 rounded-xl border border-white/10 text-sm text-neutral-400">
            Para cualquier consulta sobre privacidad o protección de datos, contacta con nosotros en{' '}
            <a href="mailto:acedonu81@gmail.com" style={{ color: '#D4AF37' }}>acedonu81@gmail.com</a>
          </div>
        </div>
        <FooterPublic />
      </div>
    </>
  );
}
