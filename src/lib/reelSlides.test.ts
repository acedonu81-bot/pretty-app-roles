import { describe, it, expect } from 'vitest';
import { buildReelSlides } from './reelSlides';

describe('buildReelSlides', () => {
  it('perfil sin vídeo: solo el slide de foto', () => {
    const slides = buildReelSlides({ photo_url: 'https://x.test/photo.jpg', bio_video_url: null, video_session_urls: null });
    expect(slides).toEqual([{ type: 'photo', url: 'https://x.test/photo.jpg' }]);
  });

  it('perfil sin foto y sin vídeo: slide de foto con url null (fallback a inicial)', () => {
    const slides = buildReelSlides({ photo_url: null, bio_video_url: null, video_session_urls: null });
    expect(slides).toEqual([{ type: 'photo', url: null }]);
  });

  it('perfil con solo bio_video_url reproducible: 2 slides', () => {
    const slides = buildReelSlides({ photo_url: 'https://x.test/photo.jpg', bio_video_url: 'https://x.test/video.mp4', video_session_urls: null });
    expect(slides).toEqual([
      { type: 'photo', url: 'https://x.test/photo.jpg' },
      { type: 'video', url: 'https://x.test/video.mp4' },
    ]);
  });

  it('bio_video_url no reproducible (enlace YouTube): se omite ese slide', () => {
    const slides = buildReelSlides({ photo_url: 'https://x.test/photo.jpg', bio_video_url: 'https://youtube.com/watch?v=abc123', video_session_urls: null });
    expect(slides).toEqual([{ type: 'photo', url: 'https://x.test/photo.jpg' }]);
  });

  it('perfil con bio_video_url + 2 sesiones: 4 slides en orden', () => {
    const slides = buildReelSlides({
      photo_url: 'https://x.test/photo.jpg',
      bio_video_url: 'https://x.test/main.mp4',
      video_session_urls: ['https://x.test/session1.mp4', 'https://x.test/session2.webm'],
    });
    expect(slides).toEqual([
      { type: 'photo', url: 'https://x.test/photo.jpg' },
      { type: 'video', url: 'https://x.test/main.mp4' },
      { type: 'video', url: 'https://x.test/session1.mp4' },
      { type: 'video', url: 'https://x.test/session2.webm' },
    ]);
  });

  it('perfil con solo sesiones (sin bio_video_url reproducible): foto + sesiones', () => {
    const slides = buildReelSlides({
      photo_url: 'https://x.test/photo.jpg',
      bio_video_url: null,
      video_session_urls: ['https://x.test/session1.mov'],
    });
    expect(slides).toEqual([
      { type: 'photo', url: 'https://x.test/photo.jpg' },
      { type: 'video', url: 'https://x.test/session1.mov' },
    ]);
  });

  it('video_session_urls vacío (array []) no añade slides extra', () => {
    const slides = buildReelSlides({ photo_url: 'https://x.test/photo.jpg', bio_video_url: null, video_session_urls: [] });
    expect(slides).toEqual([{ type: 'photo', url: 'https://x.test/photo.jpg' }]);
  });

  it('portfolio_urls se insertan como fotos entre la principal y los vídeos', () => {
    const slides = buildReelSlides({
      photo_url: 'https://x.test/photo.jpg',
      portfolio_urls: ['https://x.test/port1.jpg', 'https://x.test/port2.jpg'],
      bio_video_url: 'https://x.test/main.mp4',
      video_session_urls: null,
    });
    expect(slides).toEqual([
      { type: 'photo', url: 'https://x.test/photo.jpg' },
      { type: 'photo', url: 'https://x.test/port1.jpg' },
      { type: 'photo', url: 'https://x.test/port2.jpg' },
      { type: 'video', url: 'https://x.test/main.mp4' },
    ]);
  });

  it('portfolio_urls no duplica la foto si coincide con la principal', () => {
    const slides = buildReelSlides({
      photo_url: 'https://x.test/photo.jpg',
      portfolio_urls: ['https://x.test/photo.jpg', 'https://x.test/port1.jpg'],
      bio_video_url: null,
      video_session_urls: null,
    });
    expect(slides).toEqual([
      { type: 'photo', url: 'https://x.test/photo.jpg' },
      { type: 'photo', url: 'https://x.test/port1.jpg' },
    ]);
  });

  it('portfolio_urls null/undefined no rompe (comportamiento igual que antes)', () => {
    const slides = buildReelSlides({ photo_url: 'https://x.test/photo.jpg', portfolio_urls: null, bio_video_url: null, video_session_urls: null });
    expect(slides).toEqual([{ type: 'photo', url: 'https://x.test/photo.jpg' }]);
  });

  it('salta fotos de portfolio que son la misma imagen subida dos veces (mismo nombre original, distinta URL)', () => {
    const slides = buildReelSlides({
      photo_url: 'https://x.test/audio-sessions/u1/photo-1787846364925-IMG_8595.jpeg',
      portfolio_urls: [
        'https://x.test/audio-sessions/u1/portfolio/1787846558094-IMG_8595.jpeg', // misma foto, subida de nuevo
        'https://x.test/audio-sessions/u1/portfolio/1787846999999-IMG_9000.jpeg', // foto distinta de verdad
      ],
      bio_video_url: null,
      video_session_urls: null,
    });
    expect(slides).toEqual([
      { type: 'photo', url: 'https://x.test/audio-sessions/u1/photo-1787846364925-IMG_8595.jpeg' },
      { type: 'photo', url: 'https://x.test/audio-sessions/u1/portfolio/1787846999999-IMG_9000.jpeg' },
    ]);
  });

  it('salta duplicados entre dos fotos de portfolio (no solo contra la principal)', () => {
    const slides = buildReelSlides({
      photo_url: 'https://x.test/photo.jpg',
      portfolio_urls: [
        'https://x.test/portfolio/1000000001-foto.jpg',
        'https://x.test/portfolio/1000000002-foto.jpg', // mismo nombre original que el anterior
      ],
      bio_video_url: null,
      video_session_urls: null,
    });
    expect(slides).toEqual([
      { type: 'photo', url: 'https://x.test/photo.jpg' },
      { type: 'photo', url: 'https://x.test/portfolio/1000000001-foto.jpg' },
    ]);
  });
});
