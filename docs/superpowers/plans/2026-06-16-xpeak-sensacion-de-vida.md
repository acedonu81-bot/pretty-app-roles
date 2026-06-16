# XPEAK con vida Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reinforce the perception that XPEAK is a live, active platform across the landing page and dashboard, using only real Supabase data — no invented numbers or fake activity.

**Architecture:** Two new lightweight read hooks (`useLiveStats`, `useAvailableNow`) feed two new landing components. A new `contact_events` table captures anonymous signals from the public contact form. `useActivityFeed` is extended to merge profile sign-ups and contact events into one combined, time-sorted feed, which both the landing pills and a redesigned dashboard ticker consume.

**Tech Stack:** React + TypeScript, Supabase JS client + SQL migration, Vitest + @testing-library/react.

---

### Task 1: `contact_events` table

**Files:**
- Create: `supabase/migrations/20260616_contact_events.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Anonymous record of public contact-form submissions (no requester PII),
-- used to power the "alguien contactó a un DJ en Madrid" activity signal.
create table if not exists public.contact_events (
  id uuid primary key default gen_random_uuid(),
  professional_role text not null,
  professional_zone text,
  created_at timestamptz not null default now()
);

alter table public.contact_events enable row level security;

-- Anyone (including anonymous visitors using the public contact form) can log an event
create policy "contact_events_insert_anon" on public.contact_events
  for insert to anon with check (true);

create policy "contact_events_insert_authenticated" on public.contact_events
  for insert to authenticated with check (true);

-- Public read so the landing/dashboard activity feed can show it to anyone
create policy "contact_events_select_public" on public.contact_events
  for select using (true);

create index if not exists contact_events_created_at_idx on public.contact_events(created_at desc);
```

- [ ] **Step 2: Apply locally and verify**

Run: `npx supabase db push` (or the project's existing migration-apply command — check `package.json` scripts for a `db:push` or similar entry first; if none exists, this is the standard Supabase CLI command for this repo's migration folder).
Expected: migration applies with no errors, `contact_events` table visible via `npx supabase db diff` showing no pending changes afterward.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260616_contact_events.sql
git commit -m "feat: add contact_events table for anonymous contact-form signals"
```

---

### Task 2: `useLiveStats` hook

**Files:**
- Create: `src/hooks/useLiveStats.ts`
- Test: `src/hooks/useLiveStats.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/hooks/useLiveStats.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLiveStats } from './useLiveStats';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockFrom(impl: (table: string, callIndex: number) => any) {
  let callIndex = 0;
  (supabase.from as any).mockImplementation((table: string) => {
    const builder = impl(table, callIndex);
    callIndex++;
    return builder;
  });
}

describe('useLiveStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('computes active professionals, available now, and distinct cities', async () => {
    mockFrom((table) => {
      if (table !== 'profiles') throw new Error(`unexpected table ${table}`);
      return {
        select: vi.fn((_cols: string, opts?: any) => {
          // count-only head queries (active professionals / available now)
          if (opts?.head) {
            const eqChain = {
              neq: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              then: undefined,
            };
            // Resolve with different counts depending on whether eq('is_flash_active', true) was chained.
            const result = { count: 12, error: null };
            eqChain.neq = vi.fn().mockReturnValue(Promise.resolve(result));
            eqChain.eq = vi.fn().mockReturnValue({
              neq: vi.fn().mockReturnValue(Promise.resolve({ count: 4, error: null })),
            });
            return eqChain;
          }
          // zone-listing query for distinct cities
          return {
            neq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({
                data: [{ zone: 'Madrid' }, { zone: 'Madrid' }, { zone: 'Valencia' }],
                error: null,
              }),
            }),
          };
        }),
      };
    });

    const { result } = renderHook(() => useLiveStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats).toEqual({
      activeProfessionals: 12,
      availableNow: 4,
      cities: 2,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useLiveStats.test.ts`
Expected: FAIL with `Failed to resolve import "./useLiveStats"` (file doesn't exist yet)

- [ ] **Step 3: Write minimal implementation**

```ts
// src/hooks/useLiveStats.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveStats {
  activeProfessionals: number;
  availableNow: number;
  cities: number;
}

const POLL_INTERVAL_MS = 60_000;

async function countActiveProfessionals(): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('user_id', { count: 'exact', head: true })
    .neq('role', 'pending');
  if (error) {
    console.error('[useLiveStats] activeProfessionals error:', error);
    return 0;
  }
  return count ?? 0;
}

async function countAvailableNow(): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('user_id', { count: 'exact', head: true })
    .eq('is_flash_active', true)
    .neq('role', 'pending');
  if (error) {
    console.error('[useLiveStats] availableNow error:', error);
    return 0;
  }
  return count ?? 0;
}

async function countDistinctCities(): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('zone')
    .neq('role', 'pending')
    .not('zone', 'is', null);
  if (error) {
    console.error('[useLiveStats] cities error:', error);
    return 0;
  }
  return new Set((data ?? []).map((r: any) => r.zone)).size;
}

export function useLiveStats(): { stats: LiveStats | null; loading: boolean } {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [activeProfessionals, availableNow, cities] = await Promise.all([
      countActiveProfessionals(),
      countAvailableNow(),
      countDistinctCities(),
    ]);

    if (activeProfessionals === 0) {
      setStats(null);
      setLoading(false);
      return;
    }

    setStats({ activeProfessionals, availableNow, cities });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { stats, loading };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useLiveStats.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLiveStats.ts src/hooks/useLiveStats.test.ts
git commit -m "feat: add useLiveStats hook for real platform-size counters"
```

---

### Task 3: Live stats bar on the landing hero

**Files:**
- Modify: `src/pages/Landing.tsx`

- [ ] **Step 1: Import the hook and icons**

At the top of `src/pages/Landing.tsx`, alongside the existing `useActivityFeed` import (around line 123):

```tsx
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useLiveStats } from '@/hooks/useLiveStats';
```

`Users`, `Zap`, and `Globe` are already imported from `lucide-react` in this file's icon import line — no change needed there.

- [ ] **Step 2: Call the hook and remove the dead `userCount` state**

`Landing.tsx:609` currently declares `const [userCount, setUserCount] = useState<number | null>(null);` and `Landing.tsx:616-618` fetches it but it is never rendered anywhere (dead code). Replace both with the new hook.

Current code at `Landing.tsx:604-622`:

```tsx
const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [cityValue, setCityValue] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [communityReviews, setCommunityReviews] = useState<{ reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]>([]);
  const { items: activityItems } = useActivityFeed();

  useEffect(() => {
    supabase.from('profiles').select('user_id', { count: 'exact', head: true })
      .then(({ count }) => { if (count !== null) setUserCount(count); });
    supabase.from('reviews').select('reviewer_name, reviewer_role, reviewer_avatar, comment')
      .eq('approved', true).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data && data.length > 0) setCommunityReviews(data as { reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]); });
  }, []);
```

Replace with:

```tsx
const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [cityValue, setCityValue] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [communityReviews, setCommunityReviews] = useState<{ reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]>([]);
  const { items: activityItems } = useActivityFeed();
  const { stats } = useLiveStats();

  useEffect(() => {
    supabase.from('reviews').select('reviewer_name, reviewer_role, reviewer_avatar, comment')
      .eq('approved', true).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data && data.length > 0) setCommunityReviews(data as { reviewer_name: string; reviewer_role: string; reviewer_avatar: string | null; comment: string }[]); });
  }, []);
```

- [ ] **Step 3: Replace the hardcoded checklist line and add the stats bar**

Current code at `Landing.tsx:919-927`:

```tsx
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-4">
            {[
              '✓ 31 profesionales publicados',
              '✓ 0€ comisión para contratar',
              '✓ Sin tarjeta de crédito',
            ].map(t => (
              <span key={t} className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>{t}</span>
            ))}
          </div>
```

Replace with (the first line now uses the real count and disappears if stats aren't loaded yet, instead of showing a stale invented number):

```tsx
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-4">
            {[
              stats ? `✓ ${stats.activeProfessionals} profesionales publicados` : null,
              '✓ 0€ comisión para contratar',
              '✓ Sin tarjeta de crédito',
            ].filter((t): t is string => t !== null).map(t => (
              <span key={t} className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>{t}</span>
            ))}
          </div>

          {stats && (
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 mt-6">
              <div className="flex items-center gap-2">
                <Users size={15} style={{ color: '#D4AF37' }} />
                <span className="text-sm font-black" style={{ color: '#fff' }}>{stats.activeProfessionals}</span>
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>profesionales activos</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={15} style={{ color: '#22c55e' }} />
                <span className="text-sm font-black" style={{ color: '#fff' }}>{stats.availableNow}</span>
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>disponibles ahora</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={15} style={{ color: '#D4AF37' }} />
                <span className="text-sm font-black" style={{ color: '#fff' }}>{stats.cities}</span>
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>ciudades</span>
              </div>
            </div>
          )}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the landing page.
Confirm: the checklist row shows the real profesional count (not "31"), and below it a 3-stat row appears with real numbers. If `useLiveStats` returns `null` (e.g. local DB empty), confirm the stats row is simply absent with no layout gap or broken styling.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: show real live stats bar on landing, remove hardcoded professional count"
```

---

### Task 4: `useAvailableNow` hook

**Files:**
- Create: `src/hooks/useAvailableNow.ts`
- Test: `src/hooks/useAvailableNow.test.ts`
- Modify: `src/hooks/useActivityFeed.ts:15-28` (export `ROLE_LABELS` so it can be reused)

- [ ] **Step 1: Export `ROLE_LABELS` from `useActivityFeed.ts`**

Current code at `src/hooks/useActivityFeed.ts:15`:

```ts
const ROLE_LABELS: Record<string, string> = {
```

Replace with:

```ts
export const ROLE_LABELS: Record<string, string> = {
```

- [ ] **Step 2: Write the failing test**

```ts
// src/hooks/useAvailableNow.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAvailableNow } from './useAvailableNow';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockAvailableProfiles(rows: any[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
  const order = vi.fn().mockReturnValue({ limit });
  const neq = vi.fn().mockReturnValue({ order });
  const eq = vi.fn().mockReturnValue({ neq });
  const select = vi.fn().mockReturnValue({ eq });
  (supabase.from as any).mockReturnValue({ select });
}

describe('useAvailableNow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps available profiles with role label and color', async () => {
    mockAvailableProfiles([
      { user_id: '1', display_name: 'Marta', role: 'dj', zone: 'Madrid', updated_at: new Date().toISOString() },
      { user_id: '2', display_name: 'Carlos', role: 'staff', zone: 'Barcelona', updated_at: new Date().toISOString() },
    ]);

    const { result } = renderHook(() => useAvailableNow());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.professionals).toEqual([
      { userId: '1', roleLabel: 'DJ / Artista', roleColor: '#4285F4', zone: 'Madrid' },
      { userId: '2', roleLabel: 'Staff / Camarero', roleColor: '#34D399', zone: 'Barcelona' },
    ]);
  });

  it('returns an empty list when nobody is available', async () => {
    mockAvailableProfiles([]);

    const { result } = renderHook(() => useAvailableNow());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.professionals).toEqual([]);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/hooks/useAvailableNow.test.ts`
Expected: FAIL with `Failed to resolve import "./useAvailableNow"` (file doesn't exist yet)

- [ ] **Step 4: Write minimal implementation**

```ts
// src/hooks/useAvailableNow.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_LABELS, ROLE_COLORS } from './useActivityFeed';

export interface AvailableProfessional {
  userId: string;
  roleLabel: string;
  roleColor: string;
  zone: string | null;
}

const POLL_INTERVAL_MS = 60_000;
const LIMIT = 5;

export function useAvailableNow(): { professionals: AvailableProfessional[]; loading: boolean } {
  const [professionals, setProfessionals] = useState<AvailableProfessional[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, role, zone, updated_at')
      .eq('is_flash_active', true)
      .neq('role', 'pending')
      .order('updated_at', { ascending: false })
      .limit(LIMIT);

    if (error) {
      console.error('[useAvailableNow] fetch error:', error);
      setProfessionals([]);
      setLoading(false);
      return;
    }

    setProfessionals((data ?? []).map((row: any) => ({
      userId: row.user_id,
      roleLabel: ROLE_LABELS[row.role] ?? row.role,
      roleColor: ROLE_COLORS[row.role] ?? '#D4AF37',
      zone: row.zone,
    })));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { professionals, loading };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/hooks/useAvailableNow.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useActivityFeed.ts src/hooks/useAvailableNow.ts src/hooks/useAvailableNow.test.ts
git commit -m "feat: add useAvailableNow hook for real-time Flash Booking availability"
```

---

### Task 5: "Disponibles ahora" ribbon on the landing

**Files:**
- Modify: `src/pages/Landing.tsx`

- [ ] **Step 1: Import the hook**

Alongside the imports added in Task 3:

```tsx
import { useAvailableNow } from '@/hooks/useAvailableNow';
```

- [ ] **Step 2: Call the hook**

In the `Landing` component body, next to the `useLiveStats()` call added in Task 3:

```tsx
const { stats } = useLiveStats();
const { professionals: availableNow } = useAvailableNow();
```

- [ ] **Step 3: Render the ribbon below the stats bar**

Immediately after the stats bar block added in Task 3 Step 3 (the `{stats && (...)}` block), add:

```tsx
          {availableNow.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {availableNow.map(p => (
                <span key={p.userId}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: `${p.roleColor}1f`, color: p.roleColor, border: `1px solid ${p.roleColor}40` }}>
                  <Zap size={10} /> {p.roleLabel}{p.zone ? ` · ${p.zone}` : ''}
                </span>
              ))}
            </div>
          )}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the landing page.
With at least one profile in the connected Supabase project having `is_flash_active = true`, confirm a row of pills appears below the stats bar showing role + zone. With zero such profiles, confirm nothing renders (no empty gap).

- [ ] **Step 5: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: show real Flash Booking availability ribbon on landing"
```

---

### Task 6: Log anonymous contact events from the public contact form

**Files:**
- Modify: `src/components/PublicContactModal.tsx`
- Modify: `src/pages/PublicProfile.tsx:817-823`

- [ ] **Step 1: Add `professionalRole` and `professionalZone` props**

Current code at `src/components/PublicContactModal.tsx:5-9`:

```tsx
interface Props {
  professionalName: string;
  professionalUserId: string;
  onClose: () => void;
}
```

Replace with:

```tsx
interface Props {
  professionalName: string;
  professionalUserId: string;
  professionalRole: string;
  professionalZone: string | null;
  onClose: () => void;
}
```

Current code at `src/components/PublicContactModal.tsx:16`:

```tsx
export default function PublicContactModal({ professionalName, professionalUserId, onClose }: Props) {
```

Replace with:

```tsx
export default function PublicContactModal({ professionalName, professionalUserId, professionalRole, professionalZone, onClose }: Props) {
```

- [ ] **Step 2: Insert the anonymous event after a successful send**

Current code at `src/components/PublicContactModal.tsx:22-45`:

```tsx
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.eventType) return;
    setStatus('sending');
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'flash_booking',
          data: {
            professional_user_id: professionalUserId,
            professional_name: professionalName,
            requester_name: form.name,
            requester_contact: form.email,
            event_date: form.date || 'Por confirmar',
            event_location: '',
            event_description: `[${form.eventType}] ${form.message}`,
          },
        },
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }
```

Replace with:

```tsx
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.eventType) return;
    setStatus('sending');
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'flash_booking',
          data: {
            professional_user_id: professionalUserId,
            professional_name: professionalName,
            requester_name: form.name,
            requester_contact: form.email,
            event_date: form.date || 'Por confirmar',
            event_location: '',
            event_description: `[${form.eventType}] ${form.message}`,
          },
        },
      });
      setStatus('done');
      // Anonymous activity signal — must never block the contact flow if it fails.
      try {
        await supabase.from('contact_events').insert({
          professional_role: professionalRole,
          professional_zone: professionalZone,
        });
      } catch {
        // non-critical, ignore
      }
    } catch {
      setStatus('error');
    }
  }
```

- [ ] **Step 3: Pass the new props from `PublicProfile.tsx`**

Current code at `src/pages/PublicProfile.tsx:817-823` (already fixed in this session to use `sbProfile.user_id`):

```tsx
        {showContact && profile && (
          <PublicContactModal
            professionalName={profile.name}
            professionalUserId={sbProfile ? sbProfile.user_id : String(profile.id)}
            onClose={() => setShowContact(false)}
          />
        )}
```

Replace with:

```tsx
        {showContact && profile && (
          <PublicContactModal
            professionalName={profile.name}
            professionalUserId={sbProfile ? sbProfile.user_id : String(profile.id)}
            professionalRole={profile.role}
            professionalZone={profile.zone}
            onClose={() => setShowContact(false)}
          />
        )}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open any `/p/<uuid>` profile, click "Contactar gratis", submit the form.
Confirm: the existing "¡Solicitud enviada!" success state still shows. Then check the Supabase `contact_events` table (via `supabase` dashboard or `select * from contact_events order by created_at desc limit 1`) and confirm a new row appeared with the correct role and zone.

- [ ] **Step 5: Commit**

```bash
git add src/components/PublicContactModal.tsx src/pages/PublicProfile.tsx
git commit -m "feat: log anonymous contact_events on public contact form submission"
```

---

### Task 7: Merge contact events into the combined activity feed

**Files:**
- Modify: `src/hooks/useActivityFeed.ts`
- Modify: `src/hooks/useActivityFeed.test.ts`

- [ ] **Step 1: Update the existing tests for the new merged shape**

Current code at `src/hooks/useActivityFeed.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useActivityFeed } from './useActivityFeed';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockProfilesResponse(rows: any[]) {
  const order = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: rows, error: null }) });
  const gte = vi.fn().mockReturnValue({ order });
  const neq = vi.fn().mockReturnValue({ gte });
  const not = vi.fn().mockReturnValue({ neq });
  const select = vi.fn().mockReturnValue({ not });
  (supabase.from as any).mockReturnValue({ select });
  return { select, not, neq, gte, order };
}

describe('useActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps profile rows to activity text with zone', async () => {
    const now = new Date();
    mockProfilesResponse([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ]);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items.map(i => i.text)).toEqual([
      'Marta (DJ / Artista) se unió desde Madrid',
      'Carlos (Staff / Camarero) se unió desde Barcelona',
      'Sonia (Maquilladora) se unió desde Valencia',
    ]);
  });

  it('omits the zone segment when zone is null', async () => {
    const now = new Date();
    mockProfilesResponse([
      { display_name: 'Marta', role: 'dj', zone: null, created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ]);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items[0].text).toEqual('Marta (DJ / Artista) se unió a XPEAK');
  });

  it('returns an empty list when fewer than 3 rows exist even after fallback', async () => {
    mockProfilesResponse([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: new Date().toISOString() },
    ]);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([]);
  });
});
```

Replace the whole file with:

```ts
// src/hooks/useActivityFeed.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useActivityFeed } from './useActivityFeed';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockTables(signupRows: any[], contactRows: any[]) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table === 'profiles') {
      const order = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: signupRows, error: null }) });
      const gte = vi.fn().mockReturnValue({ order });
      const neq = vi.fn().mockReturnValue({ gte });
      const not = vi.fn().mockReturnValue({ neq });
      const select = vi.fn().mockReturnValue({ not });
      return { select };
    }
    if (table === 'contact_events') {
      const order = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: contactRows, error: null }) });
      const gte = vi.fn().mockReturnValue({ order });
      const select = vi.fn().mockReturnValue({ gte });
      return { select };
    }
    throw new Error(`unexpected table ${table}`);
  });
}

describe('useActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps profile rows to activity text with zone', async () => {
    const now = new Date();
    mockTables([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ], []);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items.map(i => i.text)).toEqual([
      'Marta (DJ / Artista) se unió desde Madrid',
      'Carlos (Staff / Camarero) se unió desde Barcelona',
      'Sonia (Maquilladora) se unió desde Valencia',
    ]);
  });

  it('omits the zone segment when zone is null', async () => {
    const now = new Date();
    mockTables([
      { display_name: 'Marta', role: 'dj', zone: null, created_at: now.toISOString() },
      { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: now.toISOString() },
      { display_name: 'Sonia', role: 'makeup', zone: 'Valencia', created_at: now.toISOString() },
    ], []);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items[0].text).toEqual('Marta (DJ / Artista) se unió a XPEAK');
  });

  it('returns an empty list when fewer than 3 rows exist even after fallback', async () => {
    mockTables([
      { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: new Date().toISOString() },
    ], []);

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([]);
  });

  it('merges signup and contact events sorted by date, newest first', async () => {
    const t0 = new Date(Date.now() - 1000).toISOString();
    const t1 = new Date(Date.now() - 2000).toISOString();
    const t2 = new Date(Date.now() - 3000).toISOString();
    mockTables(
      [
        { display_name: 'Marta', role: 'dj', zone: 'Madrid', created_at: t1 },
        { display_name: 'Carlos', role: 'staff', zone: 'Barcelona', created_at: t2 },
      ],
      [
        { professional_role: 'dj', professional_zone: 'Valencia', created_at: t0 },
      ],
    );

    const { result } = renderHook(() => useActivityFeed());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items.map(i => ({ kind: i.kind, text: i.text }))).toEqual([
      { kind: 'contact', text: 'Alguien contactó a un/a DJ / Artista en Valencia' },
      { kind: 'signup', text: 'Marta (DJ / Artista) se unió desde Madrid' },
      { kind: 'signup', text: 'Carlos (Staff / Camarero) se unió desde Barcelona' },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify the new test fails**

Run: `npx vitest run src/hooks/useActivityFeed.test.ts`
Expected: FAIL — the merge test fails because `kind` doesn't exist yet and `contact_events` isn't queried.

- [ ] **Step 3: Implement the merge in `useActivityFeed.ts`**

Full replacement of `src/hooks/useActivityFeed.ts`:

```ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  text: string;
  name: string;
  role: string;
  roleLabel: string;
  roleColor: string;
  zone: string | null;
  createdAt: string;
  kind: 'signup' | 'contact';
}

export const ROLE_LABELS: Record<string, string> = {
  dj: 'DJ / Artista',
  media: 'Fotógrafo / Vídeo',
  makeup: 'Maquilladora',
  staff: 'Staff / Camarero',
  promotor: 'Promotor / RRPP',
  empresario: 'Empresario',
  event_manager: 'Encargada de Eventos',
  rookie: 'DJ Promesa',
  vestuario: 'Estilista',
  catering: 'Catering & Chef',
  ambassador: 'Embajador',
  design: 'Diseño',
  mago: 'Mago & Ilusionista',
  bailarin: 'Bailarín & Danza',
  humorista: 'Humorista & Cómico',
  monologo: 'Monólogo & Stand-Up',
  animador: 'Payaso & Animador',
  speaker: 'Speaker & Presentador',
};

export const ROLE_COLORS: Record<string, string> = {
  dj: '#4285F4',
  rookie: '#60A5FA',
  staff: '#34D399',
  event_manager: '#2DD4BF',
  makeup: '#F9A8D4',
  media: '#A78BFA',
  empresario: '#D4AF37',
  vestuario: '#FB923C',
  design: '#E879F9',
  promotor: '#38BDF8',
  catering: '#F59E0B',
  mago: '#8B5CF6',
  monologo: '#EF4444',
  bailarin: '#EC4899',
  humorista: '#F97316',
  animador: '#FBBF24',
  speaker: '#06B6D4',
};

const MIN_ITEMS = 3;
const POLL_INTERVAL_MS = 60_000;
const MAX_COMBINED_ITEMS = 20;

function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

function roleColor(role: string): string {
  return ROLE_COLORS[role] ?? '#D4AF37';
}

function signupText(row: { display_name: string; role: string; zone: string | null }): string {
  const label = roleLabel(row.role);
  return row.zone
    ? `${row.display_name} (${label}) se unió desde ${row.zone}`
    : `${row.display_name} (${label}) se unió a XPEAK`;
}

function contactText(row: { professional_role: string; professional_zone: string | null }): string {
  const label = roleLabel(row.professional_role);
  return row.professional_zone
    ? `Alguien contactó a un/a ${label} en ${row.professional_zone}`
    : `Alguien contactó a un/a ${label}`;
}

async function fetchRecentSignups(sinceIso: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, role, zone, created_at')
    .not('display_name', 'is', null)
    .neq('role', 'pending')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[useActivityFeed] signups fetch error:', error);
    return [];
  }
  return data ?? [];
}

async function fetchRecentContacts(sinceIso: string) {
  const { data, error } = await supabase
    .from('contact_events')
    .select('professional_role, professional_zone, created_at')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[useActivityFeed] contacts fetch error:', error);
    return [];
  }
  return data ?? [];
}

function buildCombinedItems(signups: any[], contacts: any[]): ActivityItem[] {
  const signupItems: ActivityItem[] = signups.map((row, i) => ({
    id: `signup-${row.created_at}-${i}`,
    text: signupText(row),
    name: row.display_name,
    role: row.role,
    roleLabel: roleLabel(row.role),
    roleColor: roleColor(row.role),
    zone: row.zone,
    createdAt: row.created_at,
    kind: 'signup' as const,
  }));

  const contactItems: ActivityItem[] = contacts.map((row, i) => ({
    id: `contact-${row.created_at}-${i}`,
    text: contactText(row),
    name: '',
    role: row.professional_role,
    roleLabel: roleLabel(row.professional_role),
    roleColor: roleColor(row.professional_role),
    zone: row.professional_zone,
    createdAt: row.created_at,
    kind: 'contact' as const,
  }));

  return [...signupItems, ...contactItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_COMBINED_ITEMS);
}

async function fetchCombined(sinceIso: string): Promise<ActivityItem[]> {
  const [signups, contacts] = await Promise.all([
    fetchRecentSignups(sinceIso),
    fetchRecentContacts(sinceIso),
  ]);
  return buildCombinedItems(signups, contacts);
}

export function useActivityFeed(): { items: ActivityItem[]; loading: boolean } {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    let combined = await fetchCombined(dayAgo);

    if (combined.length < MIN_ITEMS) {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      combined = await fetchCombined(monthAgo);
    }

    if (combined.length < MIN_ITEMS) {
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(combined);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { items, loading };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useActivityFeed.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useActivityFeed.ts src/hooks/useActivityFeed.test.ts
git commit -m "feat: merge contact events into the combined activity feed"
```

---

### Task 8: Two-row autoscrolling ticker for the dashboard widget

**Files:**
- Modify: `src/components/dashboard/ActivityFeedWidget.tsx`

- [ ] **Step 1: Replace the vertical list with a 2-row marquee**

Full replacement of `src/components/dashboard/ActivityFeedWidget.tsx`:

```tsx
import { Sparkles, MapPin, MessageCircle } from 'lucide-react';
import { useActivityFeed, ActivityItem } from '@/hooks/useActivityFeed';

const LANES = 2;
const MIN_DISPLAY = 6;

function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
}

const ActivityFeedWidget = () => {
  const { items } = useActivityFeed();

  if (items.length === 0) return null;

  const displayCount = Math.max(items.length, MIN_DISPLAY);
  const displayItems: { item: ActivityItem; lane: number }[] = Array.from(
    { length: displayCount },
    (_, i) => ({ item: items[i % items.length], lane: i % LANES }),
  );

  return (
    <div className="mx-4 md:mx-6 mt-4 rounded-xl px-4 py-3 overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>
          ACTIVIDAD RECIENTE
        </span>
      </div>
      <div className="relative h-[92px] overflow-hidden">
        {displayItems.map(({ item, lane }, i) => {
          const isNew = item.kind === 'signup' && minutesAgo(item.createdAt) < 15;
          return (
            <div
              key={`${item.id}-${i}`}
              className="absolute whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                top: lane === 0 ? 2 : 48,
                left: '100%',
                background: '#f9f8f6',
                border: '1px solid rgba(0,0,0,0.06)',
                animation: `xpeakActivityTicker ${22 + (i % 3) * 4}s ${i * 3.2}s linear infinite`,
              }}
            >
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: `${item.roleColor}22`, color: item.roleColor, border: `1px solid ${item.roleColor}55` }}>
                  {item.kind === 'contact' ? <MessageCircle size={11} /> : item.name.charAt(0).toUpperCase()}
                </div>
                {isNew && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{ background: '#22c55e', border: '1.5px solid #fff' }} />
                )}
              </div>

              {item.kind === 'contact' ? (
                <span className="text-xs font-bold" style={{ color: 'rgba(22,20,18,0.8)' }}>{item.text}</span>
              ) : (
                <>
                  <span className="text-xs font-bold" style={{ color: 'rgba(22,20,18,0.88)' }}>{item.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${item.roleColor}18`, color: item.roleColor }}>
                    {item.roleLabel}
                  </span>
                  {item.zone && (
                    <span className="text-[11px] flex items-center gap-0.5" style={{ color: 'rgba(22,20,18,0.4)' }}>
                      <MapPin size={9} /> {item.zone}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes xpeakActivityTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - 100vw)); }
        }
      `}</style>
    </div>
  );
};

export default ActivityFeedWidget;
```

This drops the previous `framer-motion`/`AnimatePresence` enter-exit list animation (no longer needed — the ticker itself is a continuous motion, so individual items don't need separate mount/unmount transitions). When `items` updates after the 60s poll, the track content is replaced and the next loop cycle picks up the new content; the `translateX(calc(-100% - 100vw))` distance guarantees each chip fully exits the widget's bounding box regardless of its actual width, since 100vw is always at least as wide as the dashboard content column.

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, log into the dashboard.
Confirm: chips flow continuously left-to-right across 2 rows, filling the full width with no empty gap on the right even if there are only 3-4 real items (they repeat in the loop). Confirm contact-event chips show a message icon instead of an initial, and signup chips keep the green "new" dot for sign-ups under 15 minutes old.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/ActivityFeedWidget.tsx
git commit -m "feat: redesign dashboard activity widget as a 2-row autoscrolling ticker"
```

---

### Task 9: Full test suite and build sanity check

**Files:** none (verification only)

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass, including the new tests from Tasks 2, 4, and 7.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors in any modified or created file.

- [ ] **Step 3: Commit (only if any fixes were needed in prior steps)**

```bash
git add -A
git commit -m "fix: address build/test issues in liveness-signals feature"
```
