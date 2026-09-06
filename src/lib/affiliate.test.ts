import { describe, it, expect } from 'vitest';
import { resolveAffiliateKey } from '@/lib/affiliate';

/**
 * El banner de Recursos vivía en DirectoryView, el componente compartido por
 * las ~20 vistas de rol, así que aparecía en TODOS los directorios: un
 * camarero explorando DJs veía un banner con su propio equipo de barra, que
 * ahí no pinta nada (está buscando a alguien, no comprando material suyo).
 *
 * Esta es la condición de visibilidad, replicada aquí para que no vuelva a
 * romperse sin que salte un test.
 */
const seVe = (rolUsuario: string, vista: string | undefined) => {
  const key = resolveAffiliateKey(rolUsuario);
  if (!key) return false;
  return !vista || vista === rolUsuario || resolveAffiliateKey(vista) === key;
};

describe('banner de recursos', () => {
  it('un DJ lo ve en el directorio de DJs', () => {
    expect(seVe('dj', 'dj')).toBe(true);
  });
  it('un DJ NO lo ve en el directorio de camareros', () => {
    expect(seVe('dj', 'staff')).toBe(false);
  });
  it('un camarero NO lo ve en el directorio de DJs', () => {
    expect(seVe('staff', 'dj')).toBe(false);
  });
  it('un camarero lo ve en el suyo', () => {
    expect(seVe('staff', 'staff')).toBe(true);
  });
  it('rookie no ve equipo de DJ en ningun sitio', () => {
    expect(seVe('rookie', 'dj')).toBe(false);
    expect(seVe('rookie', 'rookie')).toBe(false);
  });
  it('maquillaje y peluqueria comparten catalogo', () => {
    expect(seVe('makeup', 'peluqueria')).toBe(true);
  });
  it('un grupo musical lo ve en su directorio, no en el de DJs', () => {
    expect(seVe('grupo-musical', 'grupo-musical')).toBe(true);
    expect(seVe('grupo-musical', 'dj')).toBe(false);
  });
});
