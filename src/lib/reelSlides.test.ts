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
});
