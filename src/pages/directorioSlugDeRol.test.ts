import { describe, it, expect } from 'vitest';
import { directorioSlugDeRol, ROLE_CONFIG } from './DirectorioPublico';

// Oficios que se pueden elegir en el alta (OnboardingWizard ROLES) más los
// que existen en BD por otras vías.
const OFICIOS = [
  'dj', 'grupo-musical', 'media', 'makeup', 'peluqueria', 'staff', 'azafata',
  'promotor', 'catering', 'mago', 'humorista', 'animador', 'bailarin',
  'speaker', 'vestuario', 'photo-booth', 'food-truck', 'tecnico', 'alquiler', 'local_eventos',
  'event_manager', 'camarero',
];

describe('directorioSlugDeRol', () => {
  it('dj va al directorio de DJs, no al de emergentes', () => {
    expect(directorioSlugDeRol('dj')).toBe('dj');
  });

  it('traduce el rol de BD al slug público', () => {
    expect(directorioSlugDeRol('media')).toBe('fotografo');
    expect(directorioSlugDeRol('makeup')).toBe('maquillaje');
    expect(directorioSlugDeRol('peluqueria')).toBe('maquillaje');
    expect(directorioSlugDeRol('camarero')).toBe('staff');
    expect(directorioSlugDeRol('tecnico')).toBe('tecnico-sonido');
    expect(directorioSlugDeRol('local_eventos')).toBe('locales-eventos');
  });

  it('ningún oficio cae en el directorio de otro oficio', () => {
    for (const rol of OFICIOS) {
      const slug = directorioSlugDeRol(rol);
      expect(ROLE_CONFIG[slug], `${rol} -> ${slug}`).toBeDefined();
      if (rol !== 'dj') expect(slug, `${rol} cae en DJ`).not.toBe('dj');
    }
  });
});
