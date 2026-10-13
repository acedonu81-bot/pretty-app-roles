import { describe, it, expect } from 'vitest';
import { resumenAsistente } from './asistenteAlta';

describe('resumenAsistente', () => {
  it('dice en qué paso está y qué le falta, en el formato de auth_paso', () => {
    expect(resumenAsistente({ paso: 1, rol: 'dj', foto: false, ciudad: true, bio: 12, seg: 45 }))
      .toBe('paso=1 rol=dj foto=no ciudad=si bio=12 seg=45');
  });

  it('sin rol elegido lo marca como ninguno', () => {
    expect(resumenAsistente({ paso: 0, rol: '', foto: false, ciudad: false, bio: 0, seg: 3 }))
      .toBe('paso=0 rol=ninguno foto=no ciudad=no bio=0 seg=3');
  });
});
