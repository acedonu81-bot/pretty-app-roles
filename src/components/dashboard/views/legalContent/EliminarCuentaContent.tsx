// Contenido extraído literal de src/pages/EliminarCuenta.tsx (sin Helmet ni
// FooterPublic — esos quedan solo para la ruta web /eliminar-cuenta).
// Ver src/pages/EliminarCuenta.tsx para la fuente original.
export function EliminarCuentaContent() {
  return (
    <>
      <p className="mb-8" style={{ color: 'rgba(22,20,18,0.78)' }}>
        En XPEAK respetamos tu derecho a controlar tus datos personales. Puedes solicitar la eliminación completa de tu cuenta y todos los datos asociados siguiendo los pasos indicados a continuación.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Opción 1 — Desde la app (recomendado)</h2>
          <ol className="list-decimal list-inside space-y-2" style={{ color: 'rgba(22,20,18,0.78)' }}>
            <li>Inicia sesión en XPEAK</li>
            <li>Ve a tu perfil → Ajustes</li>
            <li>Desplázate hasta "Zona de peligro"</li>
            <li>Pulsa "Eliminar mi cuenta"</li>
            <li>Confirma la eliminación introduciendo tu contraseña</li>
          </ol>
          <p className="text-sm mt-3 text-muted-foreground">Tu cuenta y todos tus datos se eliminarán de forma permanente e inmediata.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Opción 2 — Por email</h2>
          <p className="mb-3" style={{ color: 'rgba(22,20,18,0.78)' }}>Envía un email a <a href="mailto:acedonu81@gmail.com" className="underline" style={{ color: '#D4AF37' }}>acedonu81@gmail.com</a> con el asunto <strong>"Solicitud eliminación de cuenta"</strong> e indica:</p>
          <ul className="list-disc list-inside space-y-1" style={{ color: 'rgba(22,20,18,0.78)' }}>
            <li>El email con el que estás registrado en XPEAK</li>
            <li>Si quieres eliminar solo algunos datos o la cuenta completa</li>
          </ul>
          <p className="text-sm mt-3 text-muted-foreground">Procesamos las solicitudes en un plazo máximo de 30 días hábiles.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Datos que se eliminan</h2>
          <ul className="list-disc list-inside space-y-1" style={{ color: 'rgba(22,20,18,0.78)' }}>
            <li>Perfil público (nombre, foto, descripción, especialidad)</li>
            <li>Historial de mensajes y conversaciones</li>
            <li>Solicitudes de booking enviadas o recibidas</li>
            <li>Contratos generados</li>
            <li>Datos de registro (email, contraseña)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#D4AF37' }}>Datos que se conservan</h2>
          <p style={{ color: 'rgba(22,20,18,0.78)' }}>Por obligación legal, conservamos durante 5 años los registros de facturación y contratos firmados electrónicamente, conforme a la legislación española vigente.</p>
        </section>
      </div>

      <div className="mt-12 p-4 rounded-xl border text-sm text-muted-foreground" style={{ borderColor: 'var(--nightlife-border)' }}>
        Para cualquier consulta sobre privacidad o protección de datos, contacta con nosotros en{' '}
        <a href="mailto:acedonu81@gmail.com" style={{ color: '#D4AF37' }}>acedonu81@gmail.com</a>
      </div>
    </>
  );
}
