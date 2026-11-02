import { describe, expect, it } from 'vitest';
import { enlacesDeSesiones } from './enlacesArtista';

describe('enlacesDeSesiones', () => {
  it('saca un enlace por plataforma y usuario, sin repetir', () => {
    expect(enlacesDeSesiones([
      'https://soundcloud.com/dj-vizard/set-uno?si=abc',
      'https://soundcloud.com/dj-vizard/set-dos',
      'https://www.mixcloud.com/DjPoly_music/dj-poly-music-to-train/',
      'https://hearthis.at/leinadj/vulcano-2/',
      'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/x/sessions/1-a.mp3',
    ])).toEqual([
      { plataforma: 'SoundCloud', url: 'https://soundcloud.com/dj-vizard/' },
      { plataforma: 'Mixcloud', url: 'https://www.mixcloud.com/DjPoly_music/' },
      { plataforma: 'hearthis', url: 'https://hearthis.at/leinadj/' },
    ]);
  });
  it('ignora enlaces cortos, embeds y basura', () => {
    expect(enlacesDeSesiones(['https://on.soundcloud.com/zz9c4', 'https://w.soundcloud.com/player/?url=x', 'no es url'])).toEqual([]);
  });
});
