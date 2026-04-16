/**
 * XPEAK — Web Push Notifications
 * Gestiona permisos, registro del service worker y suscripción push.
 */

const SW_URL = '/sw.js';
const STORAGE_KEY = 'xpeak_push_subscribed';

/** Registra el SW si no está registrado y devuelve el registro */
async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const existing = await navigator.serviceWorker.getRegistration(SW_URL);
    if (existing) return existing;
    return await navigator.serviceWorker.register(SW_URL, { scope: '/' });
  } catch {
    return null;
  }
}

/** Solicita permiso y suscribe al push. Devuelve true si ok. */
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  const reg = await getRegistration();
  if (!reg) return false;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  // Suscribir al pushManager (sin VAPID en modo basic — la suscripción es válida para notificaciones locales)
  try {
    // Intentamos suscripción completa si hay VAPID key configurada
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (vapidKey) {
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      // Aquí guardaríamos sub.toJSON() en Supabase para envíos del servidor
      console.info('[XPEAK Push] Suscripción push activa:', sub.endpoint);
    }
  } catch {
    // Sin VAPID todavía — seguimos con notificaciones locales vía SW
  }

  localStorage.setItem(STORAGE_KEY, 'true');
  return true;
}

/** Revoca el permiso / desactiva suscripción */
export async function revokePushPermission(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  const reg = await getRegistration();
  if (!reg) return;
  const sub = await reg.pushManager.getSubscription();
  if (sub) await sub.unsubscribe();
}

/** True si el usuario ya tiene push activo */
export function isPushSubscribed(): boolean {
  if (!('Notification' in window)) return false;
  return localStorage.getItem(STORAGE_KEY) === 'true' && Notification.permission === 'granted';
}

/** Muestra una notificación local inmediata vía SW (sin servidor) */
export async function showLocalNotification(title: string, body: string, url = '/dashboard'): Promise<void> {
  if (!('Notification' in window)) return;
  const reg = await getRegistration();
  if (!reg || Notification.permission !== 'granted') return;
  await reg.showNotification(title, {
    body,
    icon: '/favicon.png',
    badge: '/favicon.png',
    data: { url },
    tag: `xpeak-${Date.now()}`,
  });
}

/** Convierte una VAPID public key Base64URL a Uint8Array */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
