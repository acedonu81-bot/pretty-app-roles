# Feed de Actividad Real Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded fake "activity pills" on the landing page with real profile sign-up data, and add an equivalent compact widget to the dashboard, sharing one data-fetching hook.

**Architecture:** A single hook `useActivityFeed()` queries Supabase `profiles` for recent sign-ups (24h window, falling back to 30 days if too sparse), maps rows to display strings, and is consumed by two presentation components: the existing landing pill animation (data swapped in-place) and a new dashboard widget.

**Tech Stack:** React + TypeScript, Supabase JS client, Vitest + @testing-library/react for tests.

---

### Task 1: `useActivityFeed` hook — data fetching and mapping

**Files:**
- Create: `src/hooks/useActivityFeed.ts`
- Test: `src/hooks/useActivityFeed.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/hooks/useActivityFeed.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useActivityFeed } from './useActivityFeed';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockProfilesResponse(rows: any[]) {
  const order = vi.fn().mockResolvedValue({ data: rows, error: null });
  const limit = vi.fn().mockReturnValue({ order });
  const not = vi.fn().mockReturnValue({ limit });
  const select = vi.fn().mockReturnValue({ not });
  (supabase.from as any).mockReturnValue({ select });
  return { select, not, limit, order };
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

    expect(result.current.items).toEqual([
      { id: expect.any(String), text: 'Marta (DJ / Artista) se unió desde Madrid' },
      { id: expect.any(String), text: 'Carlos (Staff / Camarero) se unió desde Barcelona' },
      { id: expect.any(String), text: 'Sonia (Maquilladora) se unió desde Valencia' },
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

    expect(result.current.items[0]).toEqual({ id: expect.any(String), text: 'Marta (DJ / Artista) se unió a XPEAK' });
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useActivityFeed.test.ts`
Expected: FAIL with `Failed to resolve import "./useActivityFeed"` (file doesn't exist yet)

- [ ] **Step 3: Write minimal implementation**

```ts
// src/hooks/useActivityFeed.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  text: string;
}

const ROLE_LABELS: Record<string, string> = {
  dj: 'DJ / Artista',
  media: 'Fotógrafo / Vídeo',
  makeup: 'Maquilladora',
  staff: 'Staff / Camarero',
  promotor: 'Promotor / RRPP',
  empresario: 'Empresario',
};

const MIN_ITEMS = 3;
const POLL_INTERVAL_MS = 60_000;

function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

function toText(row: { display_name: string; role: string; zone: string | null }): string {
  const label = roleLabel(row.role);
  return row.zone
    ? `${row.display_name} (${label}) se unió desde ${row.zone}`
    : `${row.display_name} (${label}) se unió a XPEAK`;
}

async function fetchRecentProfiles(sinceIso: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, role, zone, created_at')
    .not('display_name', 'is', null)
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[useActivityFeed] fetch error:', error);
    return [];
  }
  return data ?? [];
}

export function useActivityFeed(): { items: ActivityItem[]; loading: boolean } {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    let rows = await fetchRecentProfiles(dayAgo);

    if (rows.length < MIN_ITEMS) {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      rows = await fetchRecentProfiles(monthAgo);
    }

    if (rows.length < MIN_ITEMS) {
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(rows.map((row: any, i: number) => ({ id: `${row.created_at}-${i}`, text: toText(row) })));
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useActivityFeed.test.ts`
Expected: PASS (3 tests)

Note: the mock builder in the test (`select -> not -> limit -> order`) must match the real call chain order in `fetchRecentProfiles` (`select -> not -> gte -> order -> limit`). If the test fails on a "not a function" error, adjust the mock chain in the test to add a `gte` link matching the implementation's actual call order — keep the implementation's chain as written above (it's the correct, minimal query), and fix the mock to match it:

```ts
function mockProfilesResponse(rows: any[]) {
  const order = vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue({ data: rows, error: null }) });
  const gte = vi.fn().mockReturnValue({ order });
  const not = vi.fn().mockReturnValue({ gte });
  const select = vi.fn().mockReturnValue({ not });
  (supabase.from as any).mockReturnValue({ select });
  return { select, not, gte, order };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useActivityFeed.ts src/hooks/useActivityFeed.test.ts
git commit -m "feat: add useActivityFeed hook for real sign-up activity data"
```

---

### Task 2: Wire real data into the landing page pills

**Files:**
- Modify: `src/pages/Landing.tsx:928-959`

- [ ] **Step 1: Read current implementation**

Current code at `src/pages/Landing.tsx:928-959`:

```tsx
{/* ── Floating activity pills ── */}
<div className="relative h-20 mt-6 overflow-hidden pointer-events-none select-none hidden md:block" aria-hidden="true">
  {[
    { text: 'DJ contratado en Madrid', delay: 0, duration: 24, top: 2 },
    { text: 'Catering confirmado en Ibiza', delay: 8, duration: 28, top: 2 },
    { text: 'Fotógrafo disponible en Valencia', delay: 16, duration: 26, top: 2 },
    { text: 'Speaker reservado en Barcelona', delay: 4, duration: 30, top: 36 },
    { text: 'Mago reservado en Sevilla', delay: 12, duration: 27, top: 36 },
    { text: 'Flash Booking activo — Mallorca', delay: 20, duration: 25, top: 36 },
  ].map((pill, i) => (
    <div
      key={i}
      className="absolute whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full"
      style={{
        top: pill.top,
        left: '100%',
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.18)',
        color: 'rgba(255,255,255,0.55)',
        animation: `floatPill ${pill.duration}s ${pill.delay}s linear infinite`,
      }}
    >
      {pill.text}
    </div>
  ))}
</div>
<style>{`
  @keyframes floatPill {
    0%   { transform: translateX(0); }
    100% { transform: translateX(calc(-100vw - 400px)); }
  }
`}</style>
```

- [ ] **Step 2: Replace with real-data version**

Add the import near the top of `src/pages/Landing.tsx` (alongside other hook imports):

```tsx
import { useActivityFeed } from '@/hooks/useActivityFeed';
```

Inside the `Landing` component function, before the `return`, add:

```tsx
const { items: activityItems } = useActivityFeed();
```

Replace the block from Step 1 with:

```tsx
{/* ── Floating activity pills ── */}
{activityItems.length > 0 && (
  <div className="relative h-20 mt-6 overflow-hidden pointer-events-none select-none hidden md:block" aria-hidden="true">
    {activityItems.map((item, i) => (
      <div
        key={item.id}
        className="absolute whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full"
        style={{
          top: i % 2 === 0 ? 2 : 36,
          left: '100%',
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.18)',
          color: 'rgba(255,255,255,0.55)',
          animation: `floatPill ${24 + (i % 3) * 3}s ${i * 4}s linear infinite`,
        }}
      >
        {item.text}
      </div>
    ))}
  </div>
)}
<style>{`
  @keyframes floatPill {
    0%   { transform: translateX(0); }
    100% { transform: translateX(calc(-100vw - 400px)); }
  }
`}</style>
```

This preserves the exact visual mechanics (alternating top rows, staggered delays/durations) while driving content from `activityItems`.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`
Open the landing page in a browser. With real sign-ups in the connected Supabase project (24h or 30-day fallback), confirm pills show real names/roles/zones. If the local/dev database has fewer than 3 qualifying profiles, confirm the pill block does not render at all (no empty animation, no leftover gap).

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: drive landing activity pills from real sign-up data"
```

---

### Task 3: Dashboard activity feed widget

**Files:**
- Create: `src/components/dashboard/ActivityFeedWidget.tsx`
- Modify: `src/pages/Dashboard.tsx:237`

- [ ] **Step 1: Write the component**

```tsx
// src/components/dashboard/ActivityFeedWidget.tsx
import { Sparkles } from 'lucide-react';
import { useActivityFeed } from '@/hooks/useActivityFeed';

const ActivityFeedWidget = () => {
  const { items } = useActivityFeed();

  if (items.length === 0) return null;

  return (
    <div className="mx-4 md:mx-6 mt-4 rounded-xl px-4 py-3"
      style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={13} style={{ color: '#D4AF37' }} />
        <span className="text-xs font-black tracking-wider" style={{ color: '#D4AF37' }}>
          ACTIVIDAD RECIENTE
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.slice(0, 5).map(item => (
          <li key={item.id} className="text-xs" style={{ color: 'rgba(22,20,18,0.65)' }}>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeedWidget;
```

- [ ] **Step 2: Mount it in the dashboard**

In `src/pages/Dashboard.tsx`, add the import near the other dashboard component imports (alongside `DashboardTopbar`):

```tsx
import ActivityFeedWidget from '@/components/dashboard/ActivityFeedWidget';
```

In `src/pages/Dashboard.tsx:236-238`, current code:

```tsx
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} onSearch={handleSearch} searchQuery={searchQuery} onHome={() => handleViewChange('dj')} />
        <ProfileIncompleteBanner onNavigate={handleViewChange} activeView={activeView} />
        <div className={`p-4 md:p-6 flex-1 md:pb-6 ${isMobile ? 'pb-[calc(6rem+env(safe-area-inset-bottom))]' : 'pb-6'}`}
```

Replace with:

```tsx
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} onSearch={handleSearch} searchQuery={searchQuery} onHome={() => handleViewChange('dj')} />
        <ProfileIncompleteBanner onNavigate={handleViewChange} activeView={activeView} />
        <ActivityFeedWidget />
        <div className={`p-4 md:p-6 flex-1 md:pb-6 ${isMobile ? 'pb-[calc(6rem+env(safe-area-inset-bottom))]' : 'pb-6'}`}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, log into the dashboard.
Confirm the widget appears between the profile-incomplete banner and the main view content, only when there's enough real activity data (per Task 1's fallback rule), and that it disappears cleanly when there isn't.

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/ActivityFeedWidget.tsx src/pages/Dashboard.tsx
git commit -m "feat: add activity feed widget to dashboard"
```

---

### Task 4: Full test suite and build sanity check

**Files:** none (verification only)

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass, including the 3 new tests from Task 1.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors in `useActivityFeed.ts`, `Landing.tsx`, `ActivityFeedWidget.tsx`, or `Dashboard.tsx`.

- [ ] **Step 3: Commit (only if any fixes were needed in prior steps)**

```bash
git add -A
git commit -m "fix: address build/test issues in activity feed feature"
```
