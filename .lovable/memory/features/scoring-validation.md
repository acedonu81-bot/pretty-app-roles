Pricing tiers by role, scoring system, and validation flow.

## Pricing Minimums
- DJ: 40-150€/hora
- Staff (Personal de Sala): desde 20€/hora
- Estilismo (Makeup): desde 30€/hora
- Empresario: no tiene tarifa (requiere aprobación admin)

## Scoring System
- Score 0-100 based on: years experience, equipment quality, social presence
- Score < 40 = Rookie
- Users can self-select "Rookie/Promesa" at registration
- Audio upload required to complete profile

## Community Voting
- Rookies need 500 votes to become "Professional" candidates
- 1 vote per registered user per 24h
- Unique constraint on (voter_id, profile_id, vote_date)

## Validation Flow
- New registrations go to "pending" status
- Empresarios go to "awaiting_admin"
- Admin sees SLA indicators: orange >12h, red >20h
- Actions: Approve PRO, Assign ROOKIE, Reject
- Each action triggers notification email

## Admin UUID
cc6f4e89-2d9a-4697-90d2-c8d23983d83b (Soporte NightLife)
