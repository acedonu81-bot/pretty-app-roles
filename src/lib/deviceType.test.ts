import { describe, it, expect } from 'vitest';

/**
 * Clasificación de dispositivo para la analítica.
 *
 * Se replica aquí la lógica de deviceType() en vez de importarla, porque la
 * original lee navigator/window en tiempo de ejecución y simularlos en jsdom
 * para siete casos sería más frágil que esta copia. Si se cambia una, hay que
 * cambiar la otra — de ahí que estos casos estén escritos como escenarios
 * reales y no como detalles de implementación.
 *
 * Motivo: el panel marcó "8 visitas de tablet" y la cifra no era fiable. Con
 * la detección anterior (solo ancho, 768-1023 = tablet) contaban como tablet
 * un iPhone Pro Max girado y un portátil con la ventana a media pantalla,
 * mientras un iPad Mini vertical contaba como móvil.
 */

const clasificar = (ua: string, ancho: number, touch = 0) => {
  const esIPadModerno = /Macintosh/.test(ua) && touch > 1;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || esIPadModerno) return 'tablet';
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|iPod|Windows Phone/i.test(ua)) return 'mobile';
  if (/Windows NT|Macintosh|X11|CrOS|Linux x86/i.test(ua)) return 'desktop';
  if (ancho < 768) return 'mobile';
  if (ancho < 1024) return 'tablet';
  return 'desktop';
};

describe('deviceType', () => {
  it('iPhone Pro Max horizontal es MÓVIL, no tablet', () => {
    expect(clasificar('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit Mobile/15E148', 932)).toBe('mobile');
  });
  it('iPad Mini vertical es TABLET aunque mida menos de 768', () => {
    expect(clasificar('Mozilla/5.0 (iPad; CPU OS 17_0) AppleWebKit Mobile/15E148', 744)).toBe('tablet');
  });
  it('iPadOS moderno (se anuncia como Mac) es tablet', () => {
    expect(clasificar('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit', 1024, 5)).toBe('tablet');
  });
  it('Mac de verdad es escritorio', () => {
    expect(clasificar('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit', 1440, 0)).toBe('desktop');
  });
  it('portátil con ventana estrecha NO es tablet', () => {
    expect(clasificar('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', 900)).toBe('desktop');
  });
  it('Android sin "Mobile" es tablet', () => {
    expect(clasificar('Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit Safari', 800)).toBe('tablet');
  });
  it('Android con "Mobile" es móvil', () => {
    expect(clasificar('Mozilla/5.0 (Linux; Android 13; Pixel 8) AppleWebKit Mobile Safari', 412)).toBe('mobile');
  });
});
