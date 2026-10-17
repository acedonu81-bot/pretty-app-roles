# WhatsApp Business en XPEAK: diseño

Fecha: 17 oct 2026. Estado: pendiente de aprobación. Nada construido.

## Intención y por qué

XPEAK depende de que el profesional responda rápido a una solicitud del Flash (15 min / 1 h). Hoy los avisos salen por notificación en la app, push y email, y los tres fallan: el push solo llega a 4 de 92 usuarios suscritos, Android/FCM no tiene emisor y el email tarda o cae en spam. WhatsApp se lee en minutos y no exige instalar la PWA ni aceptar permisos del navegador.

Éxito: que un profesional con WhatsApp activado se entere de una solicitud nueva o de un recordatorio en menos de un minuto, y que más solicitudes de particulares terminen en un "Sí, puedo".

## Objetivos

- Canal nuevo de avisos, junto a notificación, push y email. No los sustituye.
- Primer caso de uso: avisos del Flash al profesional (solicitud nueva, recordatorio 15 min, recordatorio 1 h).
- Captura del teléfono con consentimiento explícito.
- Funcionar primero con el número de pruebas de Meta (hasta 5 destinatarios) y pasar a producción después.

## No objetivos

- No es un chat. La conversación entre usuarios sigue dentro de la app.
- No se enseña nunca el número de un usuario a otro (regla fija: no sacar el contacto de la app). Todo sale como XPEAK, desde el número de XPEAK.
- Fuera de la primera entrega: avisos de chat y acuerdos, enlace mágico del particular por WhatsApp, verificación del teléfono con código, mensajes de marketing, bot de soporte, respuestas bidireccionales.
- No se toca el anuncio de Instagram ni el flujo de /auth.

## Anti-objetivos (fracaso aunque funcione)

- Mandar WhatsApp a quien no dio su consentimiento (Meta bloquearía el número).
- Que un usuario vea el teléfono de otro.
- Duplicar el reparto o los recordatorios del Flash en vez de enchufarse a ellos.
- Mensajes con emojis decorativos o rayas largas (—/–) en el texto (reglas de copy de XPEAK).

## Restricciones

- Número de producción: nuevo, sin usar y sin cuenta de WhatsApp. Lo aporta Daniel. Hasta entonces, número de pruebas de Meta.
- Meta exige verificación de empresa para producción. La forma jurídica y el NIF del titular siguen sin decidir; puede bloquear la fase 3.
- Fuera de la ventana de 24 h solo se pueden mandar plantillas aprobadas por Meta.
- Se cobra por mensaje según tipo (utilidad, marketing, autenticación). Las tarifas actuales para España están sin comprobar.
- Solo 12 de 126 perfiles tienen `profiles.phone` rellenado. El teléfono tiene RLS propia (solo el dueño lo lee); no se debe abrir.
- Cosas que solo puede hacer Daniel: crear la app de Meta, el producto WhatsApp, los destinatarios de prueba, la verificación de empresa y el registro del número.

## Lo que ya existe y se reutiliza

- `remind_pending_flash_bookings()` (cron cada 5 min) ya llama a `send-push` y `send-email` por `net.http_post` con la cabecera `x-internal-secret`.
- `particular-solicitud` reparte la solicitud inicial a un máximo de 10 profesionales.
- `send-push` es el patrón a copiar: autenticación por secreto interno o clave de servicio, y respuesta `sent: 0` sin error cuando el usuario no tiene canal.

## Fases

Estas fases son la propuesta de Claude, aceptada por Daniel el 17 oct.

1. **Teléfono y consentimiento.** Pedir el teléfono a los profesionales con un texto tipo "Recibe las solicitudes por WhatsApp", con casilla de consentimiento. Guardar el opt-in con fecha y la posibilidad de retirarlo. Colocación en la interfaz (onboarding, panel o ajustes) la decide quien construya, pensando en cero fricción.
2. **`send-whatsapp` con número de pruebas.** Edge function nueva, mismo patrón de seguridad que `send-push`. Se llama desde los mismos puntos que el push en el Flash. Prueba con el móvil de Daniel como destinatario.
3. **Producción.** Número nuevo, verificación de empresa, plantillas aprobadas por Meta, tarifas confirmadas.
4. **Ampliar.** Chat, acuerdos y enlace mágico del particular, cada uno como cambio aparte.

## Decisiones tomadas por Claude (a revisar)

- Se usa la Cloud API de Meta directamente, sin intermediarios tipo Twilio o 360dialog, para evitar un sobrecoste por mensaje. Cambiable.
- Las plantillas del Flash se registran como categoría utilidad.
- El WhatsApp se manda solo si hay teléfono y consentimiento; si no, no hace nada y el resto de canales siguen igual.

## Qué queda al constructor

- Esquema exacto del opt-in (columna en `profiles` o tabla aparte) y su RLS.
- Normalización del teléfono a formato internacional (E.164, prefijo +34 por defecto).
- Texto exacto de las plantillas, en el tono de los avisos actuales.
- Deduplicación y reintentos, y registro de entregas y errores.
- Gestión del webhook de estados y de la baja ("STOP").
- Cómo se despliega la función y dónde se guardan el token y el identificador del número de Meta (secretos de la función, no en el repo).
