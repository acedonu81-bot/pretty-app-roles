import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { isPushSupported, isPushSubscribed, requestPushPermission } from '@/lib/pushNotifications';
import { PUSH_ASK_EVENT, askForPush, type PushAskMotivo } from '@/lib/pushAsk';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import IosInstallSheet from '@/components/IosInstallSheet';
import { isNative } from '@/lib/capacitor';
import { track } from '@/lib/track';

const SNOOZE_KEY = 'xpeak_push_ask_snooze_until';
const SESSION_KEY = 'xpeak_push_ask_shown';
const SNOOZE_DAYS = 14;

const COPY: Record<PushAskMotivo, { title: string; body: string }> = {
  alta: {
    title: 'Que no se te escape nada',
    body: 'Activa los avisos y te enteras al momento de mensajes y solicitudes, sin estar pendiente de la app.',
  },
  mensaje: {
    title: 'Te avisamos cuando te respondan',
    body: 'Activa los avisos y verás la respuesta al momento, aunque tengas XPEAK cerrada.',
  },
  solicitud: {
    title: 'Tienes solicitudes de organizadores',
    body: 'Activa los avisos para enterarte de las próximas al momento. Responder rápido marca la diferencia.',
  },
  instalada: {
    title: 'Ya tienes XPEAK instalada, falta un paso',
    body: 'Activa los avisos y verás al momento mensajes y solicitudes, con el número en el icono como cualquier app.',
  },
};

const BLOQUEADOS = {
  title: 'Tus avisos de XPEAK están bloqueados',
  body: 'Así se te pueden escapar mensajes y solicitudes. Se activan en dos pasos:',
};

function pasosDesbloquear(ios: boolean): string[] {
  if (ios) return ['Abre Ajustes del iPhone y entra en Notificaciones.', 'Busca XPEAK y activa Permitir notificaciones.'];
  if (/Android/i.test(navigator.userAgent)) {
    return ['Mantén pulsado el icono de XPEAK y toca Información de la app.', 'Entra en Notificaciones y actívalas.'];
  }
  return ['Pulsa el icono de ajustes junto a la dirección de la web, arriba.', 'En Notificaciones, elige Permitir.'];
}

// localStorage/sessionStorage pueden lanzar (modo privado, datos bloqueados):
// si fallan, se trata como "no mostrado" y "sin descanso".
const leer = (s: Storage, k: string) => { try { return s.getItem(k); } catch { return null; } };
const guardar = (s: Storage, k: string, v: string) => { try { s.setItem(k, v); } catch { /* sin almacenamiento */ } };

function puedePreguntar(aunqueBloqueados = false): boolean {
  if (isNative || !isPushSupported()) return false;
  const p = Notification.permission;
  if (p === 'granted' || (p === 'denied' && !aunqueBloqueados)) return false;
  if (leer(sessionStorage, SESSION_KEY)) return false;
  const hasta = Number(leer(localStorage, SNOOZE_KEY) ?? 0);
  return !hasta || Date.now() > hasta;
}

export default function PushAskCard({ userId }: { userId: string }) {
  const [motivo, setMotivo] = useState<PushAskMotivo | null>(null);
  const [activando, setActivando] = useState(false);
  const [verPasosIos, setVerPasosIos] = useState(false);
  const { platform, iosBrowser, isStandalone } = useInstallPrompt();
  // En iPhone el push web solo existe con la app instalada en inicio.
  const iosSinInstalar = platform === 'ios' && !isStandalone;

  // Permiso ya concedido pero sin suscripción en este navegador (dispositivo
  // nuevo, datos borrados): se suscribe sin preguntar, no sale ningún diálogo.
  useEffect(() => {
    if (isNative || !isPushSupported()) return;
    if (Notification.permission === 'granted' && !isPushSubscribed()) {
      void requestPushPermission(userId);
    }
  }, [userId]);

  useEffect(() => {
    const onAsk = (e: Event) => {
      const m = (e as CustomEvent<PushAskMotivo>).detail;
      if (!puedePreguntar()) return;
      guardar(sessionStorage, SESSION_KEY, '1');
      setMotivo(m);
      track('push_ask_shown', { motivo: m, ios_sin_instalar: iosSinInstalar });
    };
    window.addEventListener(PUSH_ASK_EVENT, onAsk);
    return () => window.removeEventListener(PUSH_ASK_EVENT, onAsk);
  }, [iosSinInstalar]);

  // Momento 4: ya tiene la app instalada y sigue sin avisos (25 oct 2026: 4
  // de 10 usuarios de la app). Va antes que el 3 para que gane si coinciden.
  useEffect(() => {
    if (!isStandalone || !puedePreguntar(true)) return;
    guardar(sessionStorage, SESSION_KEY, '1');
    setMotivo('instalada');
    track('push_ask_shown', { motivo: 'instalada', bloqueados: Notification.permission === 'denied' });
  }, [isStandalone]);

  // Momento 3: el profesional ya tiene solicitudes sin leer de organizadores.
  useEffect(() => {
    if (!puedePreguntar()) return;
    let vivo = true;
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('type', ['event_request', 'booking'])
      .eq('is_read', false)
      .then(({ count }) => { if (vivo && (count ?? 0) > 0) askForPush('solicitud'); });
    return () => { vivo = false; };
  }, [userId]);

  if (!motivo) return null;

  const cerrar = (accion: 'ahora_no' | 'cerrar' | 'entendido') => {
    guardar(localStorage, SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000));
    track('push_ask_dismiss', { motivo, accion });
    setMotivo(null);
  };

  const activar = async () => {
    if (iosSinInstalar) {
      track('push_ask_ios_install', { motivo });
      setVerPasosIos(true);
      return;
    }
    setActivando(true);
    track('push_ask_accept', { motivo });
    const ok = await requestPushPermission(userId);
    setActivando(false);
    track('push_ask_result', { motivo, permiso: Notification.permission });
    if (ok) {
      toast.success('Avisos activados');
    } else if (Notification.permission === 'denied') {
      toast.error('Los avisos están bloqueados en tu navegador. Puedes activarlos desde sus ajustes.');
    }
    setMotivo(null);
  };

  const bloqueados = Notification.permission === 'denied';
  const { title, body } = bloqueados ? BLOQUEADOS : COPY[motivo];

  return (
    <>
      <div role="dialog" aria-label={title}
        className="fixed z-[60] left-3 right-3 bottom-20 md:left-auto md:right-6 md:bottom-6 md:w-[380px] rounded-2xl p-4 shadow-2xl"
        style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.5)' }}>
        <button type="button" onClick={() => cerrar('cerrar')} aria-label="Cerrar"
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5" style={{ color: 'rgba(0,0,0,0.5)' }}>
          <X size={16} />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.18)', color: '#7a6216' }}>
            <Bell size={18} />
          </span>
          <div>
            <p className="font-black text-sm leading-snug" style={{ color: '#111' }}>{title}</p>
            <p className="text-xs leading-relaxed mt-1" style={{ color: 'rgba(0,0,0,0.65)' }}>{body}</p>
            {bloqueados && (
              <ol className="text-xs leading-relaxed mt-2 list-decimal pl-4 space-y-1" style={{ color: '#111' }}>
                {pasosDesbloquear(platform === 'ios').map(p => <li key={p}>{p}</li>)}
              </ol>
            )}
            {iosSinInstalar && (
              <p className="text-xs leading-relaxed mt-1" style={{ color: 'rgba(0,0,0,0.65)' }}>
                En iPhone los avisos funcionan con XPEAK instalada en tu pantalla de inicio.
              </p>
            )}
          </div>
        </div>
        {bloqueados ? (
          <button type="button" onClick={() => cerrar('entendido')}
            className="w-full mt-4 py-2.5 rounded-xl font-black text-sm"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#111' }}>
            Entendido
          </button>
        ) : (
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={activar} disabled={activando}
            className="flex-1 py-2.5 rounded-xl font-black text-sm disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#111' }}>
            {activando ? 'Activando…' : iosSinInstalar ? 'Ver cómo instalarla' : 'Activar avisos'}
          </button>
          <button type="button" onClick={() => cerrar('ahora_no')}
            className="px-4 py-2.5 rounded-xl font-bold text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Ahora no
          </button>
        </div>
        )}
      </div>
      {verPasosIos && (
        <IosInstallSheet browser={iosBrowser} onClose={() => { setVerPasosIos(false); setMotivo(null); }} />
      )}
    </>
  );
}
