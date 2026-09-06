/**
 * XPEAK — Push notifications NATIVAS (iOS / Android vía Capacitor).
 *
 * El módulo hermano (pushNotifications.ts) usa la Web Push API: service worker
 * + VAPID. Eso funciona en Chrome de escritorio y Android web, pero en iOS
 * SOLO si el usuario instala la PWA desde Safari — dentro de la app nativa no
 * llega ni una notificación. El plugin @capacitor/push-notifications estaba
 * instalado en package.json pero ningún fichero lo importaba.
 *
 * Importa por dos motivos:
 *   1. Las notificaciones son la razón de ser de Flash Booking: una oferta que
 *      caduca en horas no sirve si el profesional se entera al día siguiente.
 *   2. Apple rechaza por "mínima funcionalidad" (guideline 4.2) las apps que
 *      son solo una web envuelta. Push nativo es funcionalidad de plataforma
 *      real, no un envoltorio.
 *
 * El token nativo se guarda en la MISMA tabla que las suscripciones web
 * (push_subscriptions), usando `endpoint` para distinguir la plataforma. Así
 * el emisor consulta un único sitio.
 */

import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

/** Prefijos que identifican la plataforma dentro de `endpoint`. */
const PREFIJO = {
  ios: 'apns://',
  android: 'fcm://',
} as const;

export const esAppNativa = () => Capacitor.isNativePlatform();

/**
 * Registra el dispositivo para push nativo y guarda el token.
 *
 * Devuelve false —sin lanzar— si no es app nativa, si el usuario deniega el
 * permiso o si el plugin no está disponible: la app nunca debe romperse por
 * una notificación.
 */
export async function registrarPushNativo(userId: string): Promise<boolean> {
  if (!esAppNativa() || !userId) return false;

  try {
    // Import dinámico: en web el plugin no existe y un import estático
    // rompería el bundle del navegador.
    const { PushNotifications } = await import('@capacitor/push-notifications');

    const permiso = await PushNotifications.checkPermissions();
    let estado = permiso.receive;
    if (estado === 'prompt' || estado === 'prompt-with-rationale') {
      estado = (await PushNotifications.requestPermissions()).receive;
    }
    if (estado !== 'granted') return false;

    // El token llega por evento, no como valor de retorno.
    const token = await new Promise<string | null>((resolve) => {
      const tiempoLimite = setTimeout(() => resolve(null), 12_000);

      PushNotifications.addListener('registration', (t) => {
        clearTimeout(tiempoLimite);
        resolve(t.value);
      });
      PushNotifications.addListener('registrationError', () => {
        clearTimeout(tiempoLimite);
        resolve(null);
      });
      PushNotifications.register();
    });

    if (!token) return false;

    const plataforma = Capacitor.getPlatform() === 'ios' ? PREFIJO.ios : PREFIJO.android;
    const sb = supabase as unknown as {
      from: (t: string) => {
        upsert: (v: Record<string, unknown>, o?: Record<string, unknown>) => Promise<{ error: unknown }>;
      };
    };

    // Mismo esquema que la suscripción web: p256dh/auth son NOT NULL, así que
    // se rellenan con la plataforma en vez de dejarlos vacíos — el emisor
    // distingue por el prefijo del endpoint.
    await sb.from('push_subscriptions').upsert({
      user_id: userId,
      endpoint: plataforma + token,
      p256dh: Capacitor.getPlatform(),
      auth: 'native',
    }, { onConflict: 'endpoint' });

    return true;
  } catch {
    return false;
  }
}

/**
 * Escucha las notificaciones entrantes. Se llama una vez al arrancar la app.
 *
 * `onAbrir` recibe la ruta interna a la que navegar cuando el usuario toca la
 * notificación — sin esto, tocar un aviso de Flash Booking abre la app en la
 * pantalla de inicio y el profesional tiene que buscar la oferta a mano.
 */
export async function escucharPushNativo(onAbrir?: (ruta: string) => void) {
  if (!esAppNativa()) return;

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    // App en primer plano: iOS no muestra el aviso solo, así que sin este
    // listener la notificación se pierde en silencio.
    await PushNotifications.addListener('pushNotificationReceived', () => {
      // El aviso lo pinta el sistema (presentationOptions en capacitor.config).
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (accion) => {
      const ruta = (accion.notification.data as Record<string, unknown> | undefined)?.route;
      if (typeof ruta === 'string' && ruta.startsWith('/')) onAbrir?.(ruta);
    });
  } catch {
    // Plugin no disponible: la app sigue funcionando sin push.
  }
}

/** Quita el registro de este dispositivo (al desactivar avisos o cerrar sesión). */
export async function desregistrarPushNativo(): Promise<void> {
  if (!esAppNativa()) return;
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    await PushNotifications.removeAllListeners();
  } catch { /* sin efecto */ }
}
