# Quién Vio Tu Perfil Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a professional, in a single discreet line on their dashboard, when a logged-in business ("empresario") has viewed their public profile recently — using only real data, never fabricated.

**Architecture:** A new `profile_business_views` table logs an anonymous (zone-only) row whenever an authenticated empresario views someone else's public profile. A new hook reads the most recent row for the logged-in professional (7-day window) and a plain-text dashboard line renders it, or nothing if there's no recent view.

**Tech Stack:** React + TypeScript, Supabase JS client + SQL migration, Vitest + @testing-library/react.

---

### Task 1: `profile_business_views` table

**Files:**
- Create: `supabase/migrations/20260616_profile_business_views.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Anonymous record of business ("empresario") views on a professional's public
-- profile, used to show "Una sala de Madrid ha visto tu perfil" on the dashboard.
-- No viewer identity is stored — only the viewer's zone, same anonymization
-- pattern as contact_events.
create table if not exists public.profile_business_views (
  id uuid primary key default gen_random_uuid(),
  viewed_user_id uuid not null,
  viewer_zone text,
  created_at timestamptz not null default now()
);

alter table public.profile_business_views enable row level security;

-- Any logged-in user can log a view (the app only calls insert when the
-- viewer's own profile role is 'empresario' — enforced client-side, see Task 3)
create policy "profile_business_views_insert_authenticated" on public.profile_business_views
  for insert to authenticated with check (true);

-- A professional can only read views of their own profile — this is private
-- feedback to them, not a public activity signal like contact_events
create policy "profile_business_views_select_own" on public.profile_business_views
  for select to authenticated using (auth.uid() = viewed_user_id);

create index if not exists profile_business_views_viewed_user_created_idx
  on public.profile_business_views(viewed_user_id, created_at desc);
```

- [ ] **Step 2: Verify the SQL is consistent with existing migrations**

Read `supabase/migrations/20260616_contact_events.sql` and confirm naming/style conventions match (lowercase keywords, `gen_random_uuid()`, `for insert to <role> with check (true)` policy style, `create index if not exists ... (col, col desc)`). There is no live Supabase CLI connection in this environment — do not attempt `npx supabase db push` against a real project; verifying the SQL by inspection against sibling migrations is sufficient.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260616_profile_business_views.sql
git commit -m "feat: add profile_business_views table for business-view social proof"
```

---

### Task 2: `useRecentBusinessView` hook

**Files:**
- Create: `src/hooks/useRecentBusinessView.ts`
- Test: `src/hooks/useRecentBusinessView.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/hooks/useRecentBusinessView.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRecentBusinessView } from './useRecentBusinessView';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

function mockViewRows(rows: any[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
  const order = vi.fn().mockReturnValue({ limit });
  const gte = vi.fn().mockReturnValue({ order });
  const eq = vi.fn().mockReturnValue({ gte });
  const select = vi.fn().mockReturnValue({ eq });
  (supabase.from as any).mockReturnValue({ select });
}

describe('useRecentBusinessView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the most recent business view with its zone', async () => {
    (useAuth as any).mockReturnValue({ user: { id: 'user-1' } });
    mockViewRows([
      { viewer_zone: 'Madrid', created_at: new Date().toISOString() },
    ]);

    const { result } = renderHook(() => useRecentBusinessView());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.view).toEqual({
      zone: 'Madrid',
      createdAt: expect.any(String),
    });
  });

  it('returns null when there are no recent views', async () => {
    (useAuth as any).mockReturnValue({ user: { id: 'user-1' } });
    mockViewRows([]);

    const { result } = renderHook(() => useRecentBusinessView());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.view).toBeNull();
  });

  it('returns null when there is no logged-in user', async () => {
    (useAuth as any).mockReturnValue({ user: null });

    const { result } = renderHook(() => useRecentBusinessView());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.view).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useRecentBusinessView.test.ts`
Expected: FAIL with `Failed to resolve import "./useRecentBusinessView"` (file doesn't exist yet)

- [ ] **Step 3: Write minimal implementation**

```ts
// src/hooks/useRecentBusinessView.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface RecentBusinessView {
  zone: string | null;
  createdAt: string;
}

const WINDOW_DAYS = 7;

export function useRecentBusinessView(): { view: RecentBusinessView | null; loading: boolean } {
  const { user } = useAuth();
  const [view, setView] = useState<RecentBusinessView | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setView(null);
      setLoading(false);
      return;
    }

    const sinceIso = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('profile_business_views')
      .select('viewer_zone, created_at')
      .eq('viewed_user_id', user.id)
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('[useRecentBusinessView] fetch error:', error);
      setView(null);
      setLoading(false);
      return;
    }

    const row = (data ?? [])[0];
    setView(row ? { zone: row.viewer_zone, createdAt: row.created_at } : null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { view, loading };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useRecentBusinessView.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useRecentBusinessView.ts src/hooks/useRecentBusinessView.test.ts
git commit -m "feat: add useRecentBusinessView hook"
```

---

### Task 3: Log the business view from `PublicProfile.tsx`

**Files:**
- Modify: `src/pages/PublicProfile.tsx`

- [ ] **Step 1: Read the current view-tracking block**

Current code at `src/pages/PublicProfile.tsx` (inside the `.then(({ data }) => { ... })` callback that runs once a profile is loaded, around line 294-298):

```tsx
    (query as Promise<{ data: SupabaseProfile | null; error: unknown }>)
      .then(({ data }) => {
        setSbProfile(data ?? null);
        if (data?.user_id) {
          // Track profile view — increment score column
          supabase.from('profiles').select('score').eq('user_id', data.user_id).maybeSingle()
            .then(({ data: s }) => {
              const current = (s?.score as number) ?? 0;
              supabase.from('profiles').update({ score: current + 1 } as any).eq('user_id', data.user_id).then(() => {});
            });
```

- [ ] **Step 2: Add the conditional business-view insert right after the score increment**

Replace that block with:

```tsx
    (query as Promise<{ data: SupabaseProfile | null; error: unknown }>)
      .then(({ data }) => {
        setSbProfile(data ?? null);
        if (data?.user_id) {
          // Track profile view — increment score column
          supabase.from('profiles').select('score').eq('user_id', data.user_id).maybeSingle()
            .then(({ data: s }) => {
              const current = (s?.score as number) ?? 0;
              supabase.from('profiles').update({ score: current + 1 } as any).eq('user_id', data.user_id).then(() => {});
            });
          // Log an anonymous business-view event when the visitor is a logged-in
          // empresario viewing someone else's profile (social-proof signal).
          if (authUser && authUser.id !== data.user_id) {
            supabase.from('profiles').select('role, zone').eq('user_id', authUser.id).maybeSingle()
              .then(({ data: viewerProfile }) => {
                if (viewerProfile?.role === 'empresario') {
                  supabase.from('profile_business_views').insert({
                    viewed_user_id: data.user_id,
                    viewer_zone: viewerProfile.zone ?? null,
                  }).then(({ error }) => {
                    if (error) console.error('[PublicProfile] profile_business_views insert error:', error);
                  });
                }
              });
          }
```

The rest of the block (loading related profiles, public posts, extended media) stays unchanged below this.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — confirm no TypeScript errors. `authUser` is already destructured from `useAuth()` earlier in this component (`const { user: authUser } = useAuth();`), so no new import is needed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/PublicProfile.tsx
git commit -m "feat: log anonymous business-view events for empresario visitors"
```

---

### Task 4: Render the compact dashboard line

**Files:**
- Create: `src/components/dashboard/RecentBusinessViewLine.tsx`
- Modify: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/dashboard/RecentBusinessViewLine.tsx
import { useRecentBusinessView } from '@/hooks/useRecentBusinessView';

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

const RecentBusinessViewLine = () => {
  const { view } = useRecentBusinessView();

  if (!view) return null;

  const text = view.zone
    ? `Una sala de ${view.zone} ha visto tu perfil · ${timeAgo(view.createdAt)}`
    : `Una sala ha visto tu perfil · ${timeAgo(view.createdAt)}`;

  return (
    <p className="mx-4 md:mx-6 mt-2 text-xs font-semibold" style={{ color: 'rgba(22,20,18,0.45)' }}>
      {text}
    </p>
  );
};

export default RecentBusinessViewLine;
```

- [ ] **Step 2: Mount it below the activity ticker**

In `src/pages/Dashboard.tsx`, add the import near the other dashboard component imports (alongside `ActivityFeedWidget`):

```tsx
import RecentBusinessViewLine from '@/components/dashboard/RecentBusinessViewLine';
```

Current code at `src/pages/Dashboard.tsx:237-239`:

```tsx
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} onSearch={handleSearch} searchQuery={searchQuery} onHome={() => handleViewChange('dj')} />
        <ProfileIncompleteBanner onNavigate={handleViewChange} activeView={activeView} />
        <ActivityFeedWidget />
```

Replace with:

```tsx
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(true)} isMobile={isMobile} onSearch={handleSearch} searchQuery={searchQuery} onHome={() => handleViewChange('dj')} />
        <ProfileIncompleteBanner onNavigate={handleViewChange} activeView={activeView} />
        <ActivityFeedWidget />
        <RecentBusinessViewLine />
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, log into the dashboard.
With a real row in `profile_business_views` for the logged-in user within the last 7 days, confirm the line appears below the activity ticker showing the zone and relative time, with no box/border/icon — just plain secondary-color text. Confirm it's absent (no gap) when there's no recent row.

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/RecentBusinessViewLine.tsx src/pages/Dashboard.tsx
git commit -m "feat: show business-view social proof line on dashboard"
```

---

### Task 5: Full test suite and build sanity check

**Files:** none (verification only)

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass, including the 3 new tests from Task 2.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors in any modified or created file.

- [ ] **Step 3: Commit (only if any fixes were needed in prior steps)**

```bash
git add -A
git commit -m "fix: address build/test issues in business-view feature"
```
