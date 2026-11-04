import { describe, expect, it } from 'vitest';
import { enlaceOriginal } from '@/components/EmbedDiferido';

describe('enlaceOriginal', () => {
  it('Mixcloud: reconstruye la página del mix desde feed', () => {
    expect(enlaceOriginal('https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fzulo%2Fsesion-techno%2F'))
      .toBe('https://www.mixcloud.com/zulo/sesion-techno/');
    expect(enlaceOriginal('https://player-widget.mixcloud.com/widget/iframe/?feed=%2Fa%2Fb%2F'))
      .toBe('https://www.mixcloud.com/a/b/');
  });
  it('SoundCloud: devuelve la url original', () => {
    expect(enlaceOriginal('https://w.soundcloud.com/player/?url=' + encodeURIComponent('https://soundcloud.com/dj/set')))
      .toBe('https://soundcloud.com/dj/set');
  });
  it('otros o inválidos: null', () => {
    expect(enlaceOriginal('https://hearthis.at/embed/1/')).toBeNull();
    expect(enlaceOriginal('no-url')).toBeNull();
  });
});
