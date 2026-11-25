import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { DJ_OCASIONES, esDjOcasion } from './DjOcasionMadrid';

const textos = (o: (typeof DJ_OCASIONES)[string]) => [
  o.titulo, o.desc, o.h1, o.intro, o.cta, o.tituloMomentos,
  ...o.preguntar.flatMap(x => [x.t, x.d]), ...o.momentos.flatMap(x => [x.t, x.d]),
  ...o.faqs('300-500 €').flatMap(f => [f.q, f.a]), ...o.faqs(null).flatMap(f => [f.q, f.a]),
].join(' | ');

describe('DJ por ocasión (Madrid)', () => {
  it('cubre boda, empresa, fiesta privada y cumpleaños solo para DJ', () => {
    expect(Object.keys(DJ_OCASIONES).sort()).toEqual(['boda', 'cumpleanos', 'evento-empresa', 'fiesta-privada']);
    expect(esDjOcasion('boda', 'dj')).toBe(true);
    expect(esDjOcasion('boda', 'fotografo')).toBe(false);
    expect(esDjOcasion('comunion', 'dj')).toBe(false);
  });

  it('respeta las reglas de copy: sin "gratis", "bolo", rayas largas ni emojis', () => {
    for (const o of Object.values(DJ_OCASIONES)) {
      const t = textos(o);
      expect(t).not.toMatch(/gratis|\bbolos?\b|[—–]/i);
      expect(t).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  it('sin precio real no da cifra', () => {
    for (const o of Object.values(DJ_OCASIONES)) {
      expect(o.faqs(null)[0].a).not.toMatch(/\d+\s*€/);
      expect(o.faqs('300-500 €')[0].a).toContain('300-500 €');
    }
  });

  it('los títulos coinciden con los de prerender-meta.mjs (lo que ve Google)', () => {
    const meta = fs.readFileSync(path.resolve(__dirname, '../../scripts/prerender-meta.mjs'), 'utf8');
    for (const o of Object.values(DJ_OCASIONES)) {
      expect(meta).toContain(`path: '/${o.slug}/contratar-dj'`);
      expect(meta).toContain(`title: '${o.titulo} | XPEAK'`);
      expect(meta).toContain(`desc: '${o.desc}'`);
    }
  });

  it('el prerender inyecta los DJs de Madrid en las mismas ocasiones', () => {
    const pre = fs.readFileSync(path.resolve(__dirname, '../../scripts/prerender-content.mjs'), 'utf8');
    const lista = pre.match(/\['boda', 'evento-empresa', 'fiesta-privada', 'cumpleanos'\]/);
    expect(lista).not.toBeNull();
  });
});
