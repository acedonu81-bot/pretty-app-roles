Pricing tiers by role, scoring system, and validation flow.

## Naming Convention
- "Rookie" renamed to "Promesa" (for DJs, Media, Design, Image)
- "Rookie" renamed to "Básico" (for Staff, Gastro)
- Pro level = paid subscription users with gold seal

## Subscription Plans
- Free (Promesa/Básico): Limited features
- Pro (29.99€/mes): Streaming, positioning, Pro seal
- Business (59.99€/mes): Multi-profile for agencies

## Pricing Minimums
- DJ: 40-150€/hora
- Staff (Personal de Sala): desde 20€/hora
- Maquillaje & Peluquería: desde 30€/hora
- Vestuario & Moda: desde 30€/hora
- Media & Contenido: desde 30€/hora
- Diseño & Visuales: desde 30€/hora
- Promoción: desde 15€/hora
- Empresario: no tiene tarifa (requiere aprobación admin)

## Registration Categories (4 groups)
- 🎵 Música: DJ
- 👥 Staff: Personal de Sala
- 💄 Imagen: Maquillaje, Vestuario
- 📸 Media & Diseño: Media, Diseño, Promoción
- 🏢 Empresa: Empresario

## Scoring System
- Score 0-100 based on: years experience, equipment quality, social presence
- Score < 40 = Promesa
- Users can self-select "Promesa" at registration
- Audio upload required to complete profile

## Community Voting
- Promesas need 500 votes to become "Professional" candidates
- 1 vote per registered user per 24h
- Unique constraint on (voter_id, profile_id, vote_date)

## Validation Flow
- New registrations go to "pending" status
- Empresarios go to "awaiting_admin"
- Admin sees SLA indicators: orange >12h, red >20h
- Actions: Approve PRO, Assign PROMESA, Reject
- Each action triggers notification email

## Admin UUID
cc6f4e89-2d9a-4697-90d2-c8d23983d83b (Soporte NightLife)
