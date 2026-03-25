NIGHTLIFE app design system and architecture decisions.

## Design System
- Font: Inter (Google Fonts)
- Background: #000000 (pure black)
- Charcoal: #1A1A1A
- Primary/Gold: #D4AF37 (Brushed Gold)
- Red: #ff5f56
- Text secondary: #8E8EA0
- Glassmorphism panels with backdrop-blur
- Ambient background with floating blurred orbs + SVG waves

## Routes
- / → Landing page (hero + role cards + TOP Weekend banner)
- /auth → Login (Google/Apple/Email)
- /dashboard → Multi-role dashboard with sidebar + admin view

## Dashboard Views
DJ, Promotor (with venue verification), Staff, Makeup, Settings, Messages, Calendar, Profile
MapaView (clean city listing), EscenarioVirtual (streaming embeds), FlashBookingWall, TopWeekend
Stats, FlashBooking toggle, Admin (metrics + user management)

## Naming
- "Last Call" renamed to "Flash Booking" everywhere
- "Top Finde" renamed to "TOP Weekend"

## Music
- Tech House stream via laut.fm (player in topbar)

## Offers
- Empresario offers visible in DJ/Staff/Makeup views via OffersWidget

## Language
UI is in Spanish (es)

## Backend
- Lovable Cloud enabled (Supabase)
- Stripe integration pending
