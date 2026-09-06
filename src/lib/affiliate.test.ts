import { describe, it, expect } from 'vitest';
import { resolveAffiliateKey, partnersForRole } from '@/lib/affiliate';

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

/**
 * Cada oficio ve SOLO la formación de lo suyo. Un curso irrelevante en el
 * panel resta credibilidad al resto: si a un camarero le aparece un máster de
 * corte de pelo, deja de fiarse también del equipo recomendado.
 */
describe('formación por oficio', () => {
  it('una peluquera ve su curso de peluquería', () => {
    const n = partnersForRole('peluqueria', 'formacion').map(p => p.name);
    expect(n.some(x => /Peluquería/i.test(x))).toBe(true);
  });

  it('un DJ ve los dos cursos de cabina (Pioneer y Denon), no el de peluquería', () => {
    const n = partnersForRole('dj', 'formacion').map(p => p.name);
    expect(n.filter(x => /PRODJ/i.test(x))).toHaveLength(2);
    expect(n.some(x => /Peluquería/i.test(x))).toBe(false);
  });

  it('los partners sin enlace de afiliado no se muestran', () => {
    // url:null = alta todavía no aprobada. Enlazar sin el enlace rastreable
    // regala la venta, así que no se pinta nada.
    for (const rol of ['dj', 'peluqueria', 'media', 'staff', 'grupo-musical']) {
      expect(partnersForRole(rol, 'formacion').every(p => !!p.url)).toBe(true);
    }
  });
});
