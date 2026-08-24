# ReelsFeed Carrusel Horizontal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir deslizar horizontalmente dentro de cada tarjeta del feed swipe (`/descubrir`) para ver el vídeo principal y las sesiones de vídeo del profesional, sin interferir con el scroll vertical que cambia de perfil.

**Architecture:** `ReelsFeed.tsx` pasa de renderizar un fondo único por tarjeta a un carrusel horizontal de "slides" (foto, vídeo principal, sesiones) calculado en memoria a partir de los datos ya disponibles del perfil. Cada tarjeta usa `scroll-snap-x` propio, anidado dentro del `scroll-snap-y` existente que cambia de perfil. Solo cambia `ReelsFeed.tsx` y el `select` de la query que alimenta `/descubrir`.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS, scroll-snap CSS nativo, IntersectionObserver.

**Spec:** `docs/superpowers/specs/2026-08-25-reels-carrusel-horizontal-design.md`

## Global Constraints

- Aplica a todos los roles del directorio por igual — no introducir ramas por categoría/rol.
- No tocar `SwipeDirectory.tsx` ni el esquema de `profiles` en Supabase.
- No añadir ninguna UI de subida de vídeo nueva — reutilizar `video_session_urls` tal cual ya existe.
- El slide 0 (foto) mantiene el overlay actual (badges, nombre, precio, bio, botones) sin cambios visuales.
- Los slides 1+ (vídeo) son pantalla completa sin overlay.
- Nunca cargar/reproducir un vídeo que no esté visible (ni vertical ni horizontalmente) — mismo criterio de rendimiento que ya aplica hoy.
- El carrusel horizontal de cada tarjeta arranca siempre en el slide 0 al montarse (tras cambio de perfil vertical).

---

### Task 1: Añadir `video_session_urls` a la query del directorio

**Files:**
- Modify: `src/pages/DirectorioPublico.tsx:270` (el `select()` dentro de `fetchDirectorioProfiles`)

**Interfaces:**
- Consumes: nada nuevo — mismo `dbRoles`/`orFilter` ya existentes en la función.
- Produces: cada objeto que devuelve `fetchDirectorioProfiles` incluye ahora la propiedad `video_session_urls: string[] | null` junto a `bio_video_url` (que ya venía, sin estar en la interfaz `DirProfile` — se mantiene igual, el consumidor en `Descubrir.tsx` usa `as any`).

- [ ] **Step 1: Modificar el select**

En `src/pages/DirectorioPublico.tsx`, línea 270, el `.select(...)` actual es:

```ts
    .select('user_id, display_name, role, roles, specialty, zone, photo_url, bio_video_url, hourly_rate, bio, is_flash_active, is_verified, is_seed, is_early_adopter, is_early_adopter_override, score, fast_responder_count, audio_embed_url, audio_session_urls, portfolio_urls, updated_at, created_at')
```

Cámbialo a (añade `video_session_urls` justo después de `bio_video_url`):

```ts
    .select('user_id, display_name, role, roles, specialty, zone, photo_url, bio_video_url, video_session_urls, hourly_rate, bio, is_flash_active, is_verified, is_seed, is_early_adopter, is_early_adopter_override, score, fast_responder_count, audio_embed_url, audio_session_urls, portfolio_urls, updated_at, created_at')
```

- [ ] **Step 2: Verificar con curl que la columna existe y responde**

Run:
```bash
SUPABASE_URL="https://ddrqhwravupjzysriblq.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcnFod3JhdnVwanp5c3JpYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjkwMTIsImV4cCI6MjA5MDE0NTAxMn0.sHR3zuVWIj6Xw_UBI_kuQCcfEFS3oQWjs0dKUtr2Puk"
curl -s "${SUPABASE_URL}/rest/v1/profiles?select=user_id,video_session_urls&limit=3" -H "apikey: ${ANON_KEY}" -H "Authorization: Bearer ${ANON_KEY}"
```
Expected: JSON con 3 filas, cada una con `video_session_urls` (array o `null`), sin error de columna inexistente.

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores (el cambio es un string dentro de `.select()`, no afecta tipos).

- [ ] **Step 4: Commit**

```bash
git add src/pages/DirectorioPublico.tsx
git commit -m "feat: incluir video_session_urls en la query del directorio para el feed swipe"
```

---

### Task 2: Extraer la lógica de slides a una función pura testeable

**Files:**
- Create: `src/lib/reelSlides.ts`
- Test: `src/lib/reelSlides.test.ts`

**Interfaces:**
- Consumes: nada (función pura, sin dependencias de React/Supabase).
- Produces:
  ```ts
  export interface ReelSlide {
    type: 'photo' | 'video';
    url: string | null; // null solo para type: 'photo' sin foto (fallback a inicial)
  }
  export function buildReelSlides(profile: {
    photo_url: string | null;
    bio_video_url?: string | null;
    video_session_urls?: string[] | null;
  }): ReelSlide[]
  ```
  `buildReelSlides` es consumida por Task 4 (`ReelsFeed.tsx`).

- [ ] **Step 1: Escribir el test que falla**

Crea `src/lib/reelSlides.test.ts`:

```ts
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
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx vitest run src/lib/reelSlides.test.ts`
Expected: FAIL — `Cannot find module './reelSlides'`.

- [ ] **Step 3: Implementar `buildReelSlides`**

Crea `src/lib/reelSlides.ts`:

```ts
// Slides de una tarjeta del feed swipe (ReelsFeed): primero la foto (con su
// overlay de info/CTAs), luego el vídeo principal si es reproducible, luego
// cada sesión de vídeo — en ese orden fijo. Función pura para poder testear
// la composición sin montar React ni Supabase.

const REPRODUCIBLE_VIDEO = /\.(mp4|webm|mov|m4v)(\?|$)/i;

export interface ReelSlide {
  type: 'photo' | 'video';
  url: string | null;
}

export function buildReelSlides(profile: {
  photo_url: string | null;
  bio_video_url?: string | null;
  video_session_urls?: string[] | null;
}): ReelSlide[] {
  const slides: ReelSlide[] = [{ type: 'photo', url: profile.photo_url }];

  const bioVideo = profile.bio_video_url ?? '';
  if (REPRODUCIBLE_VIDEO.test(bioVideo)) {
    slides.push({ type: 'video', url: bioVideo });
  }

  for (const url of profile.video_session_urls ?? []) {
    if (REPRODUCIBLE_VIDEO.test(url)) {
      slides.push({ type: 'video', url });
    }
  }

  return slides;
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npx vitest run src/lib/reelSlides.test.ts`
Expected: PASS — los 7 tests en verde.

- [ ] **Step 5: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/lib/reelSlides.ts src/lib/reelSlides.test.ts
git commit -m "feat: función pura buildReelSlides para componer slides foto+vídeo del feed"
```

---

### Task 3: Extender `ReelsProfile` con `video_session_urls`

**Files:**
- Modify: `src/components/ReelsFeed.tsx:16-31` (interfaz `ReelsProfile`)

**Interfaces:**
- Consumes: nada nuevo en este task — solo tipo.
- Produces: `ReelsProfile` gana `video_session_urls?: string[] | null`, consumida por Task 4.

- [ ] **Step 1: Añadir el campo a la interfaz**

En `src/components/ReelsFeed.tsx`, la interfaz actual (líneas 16-31) es:

```ts
export interface ReelsProfile {
  user_id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  bio_video_url?: string | null;
  zone: string | null;
  specialty: string | null;
  hourly_rate: number;
  bio: string | null;
  is_verified: boolean;
  is_flash_active: boolean;
  is_early_adopter?: boolean;
  avgRating: number;
  reviewCount: number;
}
```

Añade el campo nuevo justo después de `bio_video_url`:

```ts
export interface ReelsProfile {
  user_id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  bio_video_url?: string | null;
  video_session_urls?: string[] | null;
  zone: string | null;
  specialty: string | null;
  hourly_rate: number;
  bio: string | null;
  is_verified: boolean;
  is_flash_active: boolean;
  is_early_adopter?: boolean;
  avgRating: number;
  reviewCount: number;
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores (campo opcional, no rompe nada existente).

- [ ] **Step 3: Commit**

```bash
git add src/components/ReelsFeed.tsx
git commit -m "feat: añadir video_session_urls a la interfaz ReelsProfile"
```

---

### Task 4: Construir el carrusel horizontal — `ReelSlider` (nuevo subcomponente)

**Files:**
- Modify: `src/components/ReelsFeed.tsx` (añadir el subcomponente `ReelSlider`, sustituyendo el uso directo de `ReelMedia` dentro del `.map` de tarjetas)

**Interfaces:**
- Consumes: `buildReelSlides` de `src/lib/reelSlides.ts` (Task 2); `ReelsProfile` con `video_session_urls` (Task 3); reutiliza el componente `ReelMedia` ya existente (líneas 55-130) para renderizar el slide de foto — se reutiliza tal cual, sin modificarlo, para el slide `type: 'photo'`.
- Produces: componente `ReelSlider` que sustituye el bloque `<ReelMedia ... /><div overlay ... />` que hoy va directo dentro de cada tarjeta del `.map` en el render principal (líneas ~279-358). `ReelSlider` recibe las mismas props que hoy recibía la combinación ReelMedia+overlay, más `onOpenProfile`/`onBookNow`/`onAddToCart`/`isInCart` para los botones que hoy viven fuera de `ReelMedia`.

- [ ] **Step 1: Añadir el subcomponente `ReelSlider` en `ReelsFeed.tsx`**

Justo después del cierre de `ReelMedia` (después de la línea 130, antes de `export default function ReelsFeed`), añade:

```tsx
import { buildReelSlides, type ReelSlide } from '@/lib/reelSlides';
import { ChevronRight } from 'lucide-react';

/**
 * ReelSlider — carrusel horizontal DENTRO de una tarjeta del feed vertical.
 * Slide 0 = foto (con el overlay de info/CTAs de siempre). Slides 1+ = vídeo,
 * pantalla completa sin overlay. Scroll-snap-x propio, independiente del
 * scroll-snap-y del contenedor padre — el gesto vertical para cambiar de
 * perfil sigue funcionando sin importar en qué slide horizontal se esté.
 */
function ReelSlider({ profile: p, eager, imgError, onImgError, soundOn, active, inCart, onOpenProfile, onBookNow, onAddToCart }: {
  profile: ReelsProfile;
  eager: boolean;
  imgError: boolean;
  onImgError: () => void;
  soundOn: boolean;
  active: boolean;
  inCart: boolean;
  onOpenProfile: (p: ReelsProfile) => void;
  onBookNow: (p: ReelsProfile) => void;
  onAddToCart: (p: ReelsProfile) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hIdx, setHIdx] = useState(0);
  const slides = useMemo(() => buildReelSlides(p), [p]);

  // Al desmontar/remontar la tarjeta (siguiente perfil tras scroll vertical),
  // el carrusel horizontal ya arranca en scrollLeft 0 por defecto — no hace
  // falta resetear nada manualmente, cada instancia es nueva.

  function onHScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setHIdx(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={trackRef}
        onScroll={onHScroll}
        className="w-full h-full overflow-x-scroll snap-x snap-mandatory flex"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0 snap-start" style={{ minWidth: '100%' }}>
            {slide.type === 'photo' ? (
              <>
                <ReelMedia
                  profile={p}
                  eager={eager}
                  imgError={imgError}
                  onImgError={onImgError}
                  soundOn={soundOn}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.4) 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-5 max-w-sm" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.is_flash_active && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: '#15803d', color: '#fff' }}>
                        <Zap size={11} fill="#fff" /> Disponible ahora
                      </span>
                    )}
                    {p.is_verified && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(212,175,55,0.95)', color: '#000' }}>
                        <BadgeCheck size={11} /> Verificado
                      </span>
                    )}
                    {p.is_early_adopter && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                        style={{
                          background: 'linear-gradient(135deg,#D4AF37,#B8941E)',
                          color: '#000',
                          border: '1px solid rgba(255,255,255,0.35)',
                          boxShadow: '0 0 16px rgba(212,175,55,0.5), 0 2px 8px rgba(0,0,0,0.25)',
                        }}>
                        <Star size={11} fill="#000" /> Fundador
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black mb-1 break-words line-clamp-2" style={{ color: '#fff' }}>{p.display_name}</h2>
                  {p.specialty && <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(212,175,55,0.9)' }}>{p.specialty}</p>}

                  <div className="flex items-center gap-3 mb-2 flex-wrap text-xs" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    {p.zone && <span className="flex items-center gap-1"><MapPin size={11} />{p.zone.split(',')[0]}</span>}
                    {p.reviewCount > 0 && <span className="flex items-center gap-1"><Star size={11} fill="#D4AF37" color="#D4AF37" />{p.avgRating} ({p.reviewCount})</span>}
                    {p.hourly_rate > 0 ? <span className="font-black" style={{ color: '#fff' }}>desde {p.hourly_rate}€/h</span>
                      : <span className="font-black" style={{ color: '#fff' }}>Precio a consultar</span>}
                  </div>

                  {p.bio && (
                    <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.62)' }}>
                      {p.bio.slice(0, 110)}{p.bio.length > 110 ? '…' : ''}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => onAddToCart(p)} disabled={inCart}
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                      style={inCart
                        ? { background: 'rgba(34,197,94,0.2)', border: '1.5px solid rgba(34,197,94,0.5)' }
                        : { background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                      {inCart ? <Check size={18} color="#22c55e" /> : <Plus size={18} color="#fff" />}
                    </button>
                    <button onClick={() => onOpenProfile(p)}
                      className="h-12 px-4 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
                      Ver perfil
                    </button>
                    <button onClick={() => onBookNow(p)}
                      className="flex-1 h-12 px-5 rounded-full flex items-center justify-center gap-1.5 font-black text-sm min-w-0"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                      <MessageCircle size={16} /> Contactar
                    </button>
                  </div>
                </div>
                {slides.length > 1 && i === 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                    style={{ animation: 'reel-arrow-pulse 1.6s ease-in-out infinite' }}>
                    <ChevronRight size={26} color="rgba(255,255,255,0.85)" />
                  </div>
                )}
              </>
            ) : (
              <ReelVideoSlide url={slide.url!} active={active && hIdx === i} soundOn={soundOn} />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-8"
          style={{ marginTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
          {slides.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.3)' }}>
              <div className="h-full rounded-full" style={{ width: i === hIdx ? '100%' : '0%', background: 'rgba(255,255,255,0.9)' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Nota para el implementador:** este subcomponente inline duplica el JSX del overlay de info que hoy vive directo en el `.map` del `export default function ReelsFeed` (líneas ~293-355 del archivo original) — Task 5 elimina ese bloque duplicado del render principal y lo sustituye por `<ReelSlider />`, dejando el overlay solo aquí dentro. No dejar ambas copias.

- [ ] **Step 2: Type check (fallará hasta Task 5 por `ReelVideoSlide` sin definir — se resuelve en el siguiente task)**

Run: `npx tsc --noEmit`
Expected: FAIL — `Cannot find name 'ReelVideoSlide'`. Esto es esperado en este punto intermedio; no hacer commit todavía. Continuar directo a Task 5 antes de compilar.

---

### Task 5: `ReelVideoSlide` (subcomponente de vídeo individual) + integrar `ReelSlider` en el render principal

**Files:**
- Modify: `src/components/ReelsFeed.tsx` (añadir `ReelVideoSlide`; sustituir el render de tarjeta en el `.map` principal por `<ReelSlider />`)

**Interfaces:**
- Consumes: nada nuevo — usa las mismas props de reproducción por visibilidad que ya usa `ReelMedia`.
- Produces: `ReelVideoSlide` — componente hoja, sin necesidad de export (uso interno del archivo).

- [ ] **Step 1: Añadir `ReelVideoSlide` justo antes de `ReelSlider`**

```tsx
/**
 * Slide de vídeo individual (bio_video_url o una sesión) dentro del
 * carrusel horizontal. Mismo criterio de reproducción por visibilidad que
 * ReelMedia: solo carga/reproduce cuando `active` es true (perfil visible
 * verticalmente Y slide horizontal activo). Pantalla completa, sin overlay.
 */
function ReelVideoSlide({ url, active, soundOn }: { url: string; active: boolean; soundOn: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !soundOn;
  }, [soundOn, active]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) { v.play().catch(() => { /* autoplay bloqueado: sin efecto */ }); }
    else { v.pause(); }
  }, [active]);

  return (
    <div className="absolute inset-0 bg-black">
      {active && (
        <video
          ref={videoRef}
          src={url}
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Sustituir el bloque de render de cada tarjeta en el `.map` principal**

En `export default function ReelsFeed`, el bloque actual (aprox. líneas 279-358, dentro de `{items.map((p, i) => { ... })}`) es:

```tsx
      {items.map((p, i) => {
        const inCart = isInCart(p.user_id);
        return (
          <div key={i} className="relative w-full snap-start snap-always" style={{ height: '100dvh', contentVisibility: 'auto', containIntrinsicSize: '100dvh' } as React.CSSProperties}>
            {/* Fondo: vídeo (si lo tiene y está visible), foto, o inicial */}
            <ReelMedia
              profile={p}
              eager={i < 3}
              imgError={!!imgErrors[p.user_id]}
              onImgError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
              soundOn={soundOn}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.4) 100%)' }} />

            {/* [... todo el bloque de overlay de info + botones ...] */}
          </div>
        );
      })}
```

Sustitúyelo completo por:

```tsx
      {items.map((p, i) => {
        const inCart = isInCart(p.user_id);
        return (
          <div key={i} className="relative w-full snap-start snap-always" style={{ height: '100dvh', contentVisibility: 'auto', containIntrinsicSize: '100dvh' } as React.CSSProperties}>
            <ReelSlider
              profile={p}
              eager={i < 3}
              imgError={!!imgErrors[p.user_id]}
              onImgError={() => setImgErrors(e => ({ ...e, [p.user_id]: true }))}
              soundOn={soundOn}
              active={i === activeIdx}
              inCart={inCart}
              onOpenProfile={onOpenProfile}
              onBookNow={onBookNow}
              onAddToCart={onAddToCart}
            />
          </div>
        );
      })}
```

**Nota:** `active={i === activeIdx}` usa el índice dentro de `items` (la lista repetida para el bucle infinito) — `activeIdx` ya se calcula como `cur % profiles.length` en `onScroll` (línea ~196), así que hay un desajuste de índice entre `items` (repetido) y `activeIdx` (0 a `profiles.length-1`). Para que la comparación sea correcta, cambia la prop a `active={i % profiles.length === activeIdx}`.

- [ ] **Step 3: Añadir la animación CSS del indicador de flecha**

Busca el bloque `<style>{...}</style>` existente (línea ~251):

```tsx
      <style>{`.reels-hide-sb::-webkit-scrollbar{display:none}`}</style>
```

Sustitúyelo por (añade el keyframe de la flecha):

```tsx
      <style>{`
        .reels-hide-sb::-webkit-scrollbar{display:none}
        @keyframes reel-arrow-pulse {
          0%, 100% { opacity: 0.4; transform: translateY(-50%) translateX(0); }
          50% { opacity: 1; transform: translateY(-50%) translateX(6px); }
        }
      `}</style>
```

- [ ] **Step 4: Type check**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Verificar en navegador — perfil sin vídeo (regresión)**

Levanta el dev server (`npx vite --port 5183` desde `/Users/danielacedonunez/pretty-app-roles`, NUNCA el puerto 5173 que puede estar en uso por otro proyecto del usuario) y navega a `/descubrir` en viewport móvil (390x844). Confirma:
- Un perfil sin vídeo se ve exactamente igual que antes (foto + overlay + botones).
- No aparece flecha ni indicador de puntos.
- Scroll vertical entre perfiles sigue funcionando.

- [ ] **Step 6: Verificar en navegador — perfil con vídeo**

Si hay algún perfil real con `bio_video_url` reproducible (ej. Daniel Torrez, según memoria del proyecto), navega hasta él en `/descubrir` y confirma:
- Aparece la flecha animada a la derecha en el slide de foto.
- Deslizar horizontalmente muestra el vídeo a pantalla completa, sin overlay.
- El vídeo reproduce solo cuando ese slide está activo.
- Deslizar verticalmente desde el slide de vídeo cambia de perfil correctamente y el nuevo perfil arranca en su slide 0 (foto).

- [ ] **Step 7: Commit**

```bash
git add src/components/ReelsFeed.tsx
git commit -m "feat: carrusel horizontal de vídeos (principal + sesiones) dentro de cada tarjeta del feed swipe"
```

---

### Task 6: Deploy y verificación en producción

**Files:** ninguno (solo despliegue).

- [ ] **Step 1: Build local completo**

Run: `npm run build`
Expected: `0 fallidas` en el log de prerender, sin errores de TypeScript.

- [ ] **Step 2: Deploy a producción**

Run: `npx vercel --prod --force --yes`

- [ ] **Step 3: Verificar sitio vivo**

Run: `curl -s -o /dev/null -w "HTTP %{http_code}\n" https://xpeak.es/descubrir`
Expected: `HTTP 200`

- [ ] **Step 4: Verificar en producción con Chrome DevTools MCP**

Navega a `https://xpeak.es/descubrir` en viewport móvil real, repite las comprobaciones del Task 5 Steps 5-6 contra producción (no local). Revisa la consola con `list_console_messages` filtrando `error` — debe estar vacía.

- [ ] **Step 5: Commit final si hubo ajustes**

Si algún ajuste fue necesario tras la verificación en producción, commitéalo por separado con mensaje descriptivo del fix puntual.
