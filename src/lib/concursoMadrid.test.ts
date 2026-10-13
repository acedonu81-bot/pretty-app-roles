import { describe, it, expect } from 'vitest';
import { estadoInscripcionMadrid } from './concursoMadrid';

const perfil = (p: Partial<{ photo_url: string | null; bio: string | null; region: string | null }>) =>
  ({ photo_url: 'https://x/foto.jpg', bio: 'DJ de bodas', region: 'Madrid', ...p });

describe('estadoInscripcionMadrid', () => {
  it('DJ de la Comunidad de Madrid con foto y bio puede inscribirse', () => {
    expect(estadoInscripcionMadrid([perfil({})])).toBe('ok');
  });

  it('sin foto o sin bio primero tiene que completar el perfil', () => {
    expect(estadoInscripcionMadrid([perfil({ photo_url: null })])).toBe('falta_perfil');
    expect(estadoInscripcionMadrid([perfil({ bio: '  ' })])).toBe('falta_perfil');
  });

  it('fuera de la Comunidad de Madrid no puede inscribirse', () => {
    expect(estadoInscripcionMadrid([perfil({ region: 'Andalucía' })])).toBe('fuera_de_madrid');
  });

  it('sin ciudad en la ficha (región vacía) tampoco, hasta que la ponga', () => {
    expect(estadoInscripcionMadrid([perfil({ region: null })])).toBe('fuera_de_madrid');
  });

  it('basta con que uno de sus perfiles sea de Madrid', () => {
    expect(estadoInscripcionMadrid([perfil({ region: 'Galicia' }), perfil({ photo_url: null, region: 'Madrid' })])).toBe('ok');
  });
});
