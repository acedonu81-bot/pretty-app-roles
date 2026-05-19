# XPEAK Design System

> Drop this file in the project root. Any AI coding agent that reads it will generate UI that matches the XPEAK brand without needing to scan every component for patterns.

---

## Identity

| | |
|---|---|
| **Product name** | XPEAK |
| **Tagline** | El Directorio Profesional de la Noche |
| **Audience** | Nightlife professionals in Spain/Europe (DJs, staff, promoters, media) |
| **Mood** | Luxury-minimal. Dark, deliberate, never loud. Think high-end club entrance, not festival poster. |
| **Language** | Spanish-first. Informal (tutea). No emojis in UI. Direct tone. |

---

## Color Palette

```
Brand Gold          #D4AF37   — primary accent, CTAs, active states, highlights
Gold Light          #F5D77A   — gradients, text-gradient endpoint
Gold Dark           #B8941E   — gradient endpoint, hover states

Surface Base        #060606   — page background (pure near-black)
Surface Card        #0E0E0E   — card backgrounds
Surface Elevated    #141414   — elevated panels, dropdown backgrounds
Surface Overlay     #1A1A1A   — modal overlays

Live Red            #E53935   — LIVE indicator only — never use for general UI
Status Success      #22c55e
Status Error        #ef4444
Status Warning      #f59e0b

Text Primary        rgba(255,255,255,0.95)
Text Secondary      rgba(255,255,255,0.60)
Text Tertiary       rgba(255,255,255,0.35)
Text Disabled       rgba(255,255,255,0.20)
Text Muted          #888898

Border Default      rgba(255,255,255,0.08)
Border Subtle       rgba(255,255,255,0.05)
Border Gold Faint   rgba(212,175,55,0.08)
Border Gold Subtle  rgba(212,175,55,0.15)
Border Gold Medium  rgba(212,175,55,0.25)
Border Gold Strong  rgba(212,175,55,0.45)
Border Red Subtle   rgba(229,57,53,0.15)
Border Red Medium   rgba(229,57,53,0.30)
```

**Rule**: Gold is used for active/premium states. White at low opacity for all default surfaces. Red is LIVE indicator only. Never use pure white or pure colors — always with transparency on dark surfaces.

---

## Typography

| Role | Font | Weights | Usage |
|---|---|---|---|
| Display | **Syne** (Variable) | 700–900 | H1, H2, H3, logos, section titles |
| Body | **Inter** (Variable) | 300–700 | All body text, labels, inputs |
| Mono | *(system-ui-mono)* | 400 | Code, IDs, technical labels |

### Scale
```
2xs    0.55rem   — timestamps, micro-labels
xs     0.65rem   — badges, secondary metadata
sm     0.75rem   — captions, helper text
base   0.875rem  — default body
md     1rem      — emphasized body, subtitles
lg     1.125rem  — lead text
xl     1.25rem   — section subtitles
2xl    1.5rem    — h3
3xl    2rem      — h2
4xl    3rem      — h1 mobile
display 5rem     — hero headline
```

### Rules
- Headlines (h1/h2/h3): always `font-family: 'Syne'`, `font-weight: 900` (black)
- Body: `font-family: 'Inter'`, `font-weight: 400–600`
- Logos/wordmarks: Syne Black + `tracking-widest` (letter-spacing: 0.2em)
- Never use Inter for headlines. Never use Syne for body paragraphs.

---

## Spacing

Base unit: `4px` (0.25rem). Follow Tailwind 4-unit grid.

```
Micro    4px   — gap between inline elements (icon + label)
XS       8px   — within components (padding-x on badges)
SM      12px   — component internal padding
MD      16px   — standard padding, gaps
LG      24px   — section internal padding
XL      32px   — between sections within a view
2XL     48px   — between major sections
```

---

## Border Radius

```
sm    6px    — small badges, toggles
md    8px    — buttons, inputs, small cards
lg    12px   — standard cards
xl    16px   — panels, modals, large cards
2xl   20px   — hero cards, overlays
full  9999px — pills, avatars, dot indicators
```

---

## Shadows

```
card        0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)
card-hover  0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)
gold        0 0 20px rgba(212,175,55,0.30)
gold-strong 0 0 30px rgba(212,175,55,0.50)
gold-button 0 4px 16px rgba(212,175,55,0.35)
panel       0 20px 60px rgba(0,0,0,0.80)
```

---

## Component Patterns

### Buttons

```
Primary   — gradient(#D4AF37 → #B8941E), black text, shadow: gold-button
Secondary — bg rgba(255,255,255,0.05), gold text, border: gold-medium
Ghost     — bg rgba(255,255,255,0.04), secondary text, border: default
Danger    — bg rgba(239,68,68,0.12), #fca5a5 text, border: rgba(239,68,68,0.25)
Live      — bg rgba(229,57,53,0.12), #E53935 text, border: red-medium
```
All buttons: `border-radius: 8px`, `font-weight: 700`, `transition: all 0.2s`
Hover: `transform: scale(1.02)` on primary; `background lightened` on others.

### Cards / Surfaces

```
glass-panel  — bg rgba(14,14,14,0.85) + blur(20px) + border-default + shadow-card
glass-subtle — bg rgba(255,255,255,0.03) + blur(12px) + border-subtle
gold-surface — bg rgba(212,175,55,0.06) + border-gold-subtle
dark-panel   — bg #080808 + border-default
```

### Badges / Pills

```
gold        — bg rgba(212,175,55,0.12), color #D4AF37, border gold-subtle
gold-strong — bg rgba(212,175,55,0.20), color #D4AF37, border gold-medium
live        — bg rgba(229,57,53,0.15), color #E53935, border red-subtle
success     — bg rgba(34,197,94,0.12), color #4ade80, border rgba(34,197,94,0.25)
muted       — bg rgba(255,255,255,0.05), color text-tertiary, border default
```

### Tier Badges (subscription levels)
```
free      — #8E8EA0 on rgba(255,255,255,0.04)
starter   — #A8C5DA on rgba(168,197,218,0.08)
business  — #D4AF37 on rgba(212,175,55,0.10)
agency    — #D4AF37 on rgba(212,175,55,0.15)  [brighter than business]
elite     — same as agency
```

### Inputs

```
bg rgba(0,0,0,0.6), border default, radius 8px
focus: border gold-primary, box-shadow: 0 0 0 3px rgba(212,175,55,0.12)
placeholder: text-tertiary
```

### Empty States

Always include: icon (gold, 20px, low opacity), bold title (text-tertiary), body (text-muted), optional CTA.
Container: `glass-panel` with `py-10 px-6 text-center`.

### Loading Skeletons

Animate pulse. Use `rgba(255,255,255,0.06)` base, `rgba(255,255,255,0.10)` shimmer.

---

## Gradients

```
gold-linear  linear-gradient(90deg, #D4AF37, #B8941E)          — buttons, CTAs
gold-diag    linear-gradient(135deg, #D4AF37, #F5D77A)          — decorative, text gradients
text-gradient linear-gradient(135deg, #D4AF37, #F5D77A)        — .text-gradient utility
surface-glow radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04), transparent 60%)
dark-overlay linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)
```

---

## Animations

```
fadeIn     opacity 0→1 + translateY(10px→0), duration 0.4s
float      translateY up/down subtle, 6s infinite
ping       scale 1→2 + opacity 1→0, used on LIVE dot
shimmer    translateX -150%→350%, used on skeletons and toast shine
```

Easing:
```
smooth     cubic-bezier(0.4, 0, 0.2, 1)   — default transitions
spring     cubic-bezier(0.34, 1.56, 0.64, 1) — bouncy modals/tooltips
```

---

## Grain Texture

Apply `.grain-overlay` class to root wrappers for subtle film grain effect.
Implemented via `::after` pseudo-element with SVG feTurbulence noise at `opacity: 0.028`.
Do NOT increase opacity above `0.04` — grain is atmospheric, not dominant.

---

## Layout

```
Dashboard sidebar  260px fixed
Topbar             56px (h-14) sticky, backdrop-blur(20px), z-10
Content area       remaining width, overflow-y-auto
Mobile breakpoint  <768px — sidebar hidden, hamburger menu
```

Grid for profile cards:
```
wideCards=false  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4, gap-4
wideCards=true   grid-cols-1 sm:grid-cols-2, gap-5
```

---

## Icons

Library: **lucide-react** exclusively.
Standard sizes: `12` (micro), `14` (compact), `16` (default), `18` (nav items), `20` (section icons), `24` (feature icons).
Color: inherit or explicit gold/muted — never hardcoded for reusable components.

---

## Do Not

- Do NOT use pure white backgrounds
- Do NOT use Inter for headlines
- Do NOT use Syne for body paragraphs
- Do NOT show fake/hardcoded data (ratings, counts, viewers) — show 0 or hide the element
- Do NOT use emojis in UI components
- Do NOT use colors outside this palette
- Do NOT use `border-radius > 20px` (too bubbly, breaks the luxury-minimal mood)
- Do NOT add box-shadow on ghost/text-only elements
- Do NOT use shadows in bright gold — only on dark backgrounds

---

## Subscription Tiers (internal → display)

```
free      → "Free"
starter   → "Starter"
business  → "Business"
premium   → "Business"    (legacy alias)
agency    → "Agencia"
elite     → "Agencia"     (legacy alias)
```

Order: free < starter < business = premium < agency = elite

---

## Roles (internal → display)

```
dj         → "DJs & Artistas"
rookie     → "DJ / Artista Promesa"
staff      → "Staff & Promoción"
makeup     → "Maquillaje & Peluquería"
media      → "Media & Contenido"
empresario → "Panel Empresario"
```

---

*Generated from XPEAK codebase — April 2026. Keep in sync with `src/design/tokens.ts`.*
