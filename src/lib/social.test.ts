// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { extractInstagramHandle, instagramUrl, facebookRuta, facebookUrl, extractTiktokHandle, tiktokUrl } from './social';

// Varios perfiles reales en producción guardaron la URL completa de
// Instagram en vez del handle — sin normalizar, https://instagram.com/${raw}
// producía un link roto que abría el Instagram genérico en vez del perfil.
describe('extractInstagramHandle', () => {
  it('deja el handle limpio tal cual', () => {
    expect(extractInstagramHandle('djpoly_music')).toBe('djpoly_music');
  });

  it('quita la @ inicial', () => {
    expect(extractInstagramHandle('@djpoly_music')).toBe('djpoly_music');
  });

  it('extrae el handle de una URL sin protocolo', () => {
    expect(extractInstagramHandle('www.instagram.com/entudiamecole/')).toBe('entudiamecole');
  });

  it('extrae el handle de una URL completa con query params', () => {
    expect(extractInstagramHandle('https://www.instagram.com/sonidosalvaje.mlg?igsi=abc&utm_source=qr'))
      .toBe('sonidosalvaje.mlg');
  });
});

describe('instagramUrl', () => {
  it('construye la URL final a partir de un handle sucio', () => {
    expect(instagramUrl('https://www.instagram.com/sonidosalvaje.mlg?igsi=abc'))
      .toBe('https://instagram.com/sonidosalvaje.mlg');
  });
});

describe('redes: Facebook y TikTok (25 nov 2026)', () => {
  it('Facebook: acepta enlace, @ o nombre y se queda con la ruta', () => {
    expect(facebookRuta('https://www.facebook.com/DjPepe/')).toBe('DjPepe');
    expect(facebookRuta('facebook.com/djpepe?mibextid=abc')).toBe('djpepe');
    expect(facebookRuta('@djpepe')).toBe('djpepe');
    expect(facebookRuta('https://m.facebook.com/profile.php?id=1000123&ref=x')).toBe('profile.php?id=1000123');
    expect(facebookRuta('https://www.facebook.com/share/1AbC/')).toBe('share/1AbC');
  });
  it('Facebook: descarta otros dominios, javascript: y texto con espacios', () => {
    expect(facebookRuta('https://evil.com/x')).toBeNull();
    expect(facebookRuta('javascript:alert(1)')).toBeNull();
    expect(facebookRuta('mi pagina')).toBeNull();
    expect(facebookRuta('')).toBeNull();
  });
  it('el enlace siempre va a facebook.com', () => {
    expect(facebookUrl('djpepe')).toBe('https://www.facebook.com/djpepe');
  });
  it('TikTok: acepta @, nombre o enlace del perfil', () => {
    expect(extractTiktokHandle('@dj.pepe')).toBe('dj.pepe');
    expect(extractTiktokHandle('https://www.tiktok.com/@dj.pepe?lang=es')).toBe('dj.pepe');
    expect(tiktokUrl('dj.pepe')).toBe('https://www.tiktok.com/@dj.pepe');
  });
});
