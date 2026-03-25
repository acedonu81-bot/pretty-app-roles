# Memory: index.md
Updated: now

NIGHTLIFE app design system and architecture decisions.

## Design System
- Font: Inter (Google Fonts)
- Background: #000000 (pure black)
- Primary: #D4AF37 (Brushed Gold)
- Charcoal: #1A1A1A
- Gold light: #F5D77A
- Red: #ff5f56 (destructive only)
- Green: #22c55e (availability indicator only)
- Text secondary: #8E8EA0
- NO purple, NO pink, NO neon colors
- Glassmorphism panels with backdrop-blur
- Ambient background with floating gold blurred orbs
- Gold scrollbar gradient
- Avatars: GeometricAvatar component (SVG, gold/black, role-based patterns)

## Routes
- / → Landing page (hero + role cards)
- /auth → Login (Google/Apple/Email)
- /dashboard → Multi-role dashboard with sidebar

## Dashboard Views
DJ, Promotor, Agency, Settings, Messages, Calendar, Wallet, Profile, KYC
Staff, Makeup, Mapa, EscenarioVirtual, FlashBooking, TopWeekend, Stats, Admin

## Language
UI is in Spanish (es)

## Avatar Policy
- NO cartoon/dicebear avatars
- Use GeometricAvatar component with role-based geometric icons
- Monochromatic gold-to-black palette only
