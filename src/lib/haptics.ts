import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { isNative } from './capacitor';

/**
 * Vibración sutil reservada a acciones con intención clara de confirmación:
 * confirmar reserva, enviar Flash Booking, dar like/voto. Nunca en cada tap.
 */
export const haptics = {
  async tap() {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      /* dispositivo sin soporte — no bloquear la acción */
    }
  },
  async confirm() {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      /* ignore */
    }
  },
};
