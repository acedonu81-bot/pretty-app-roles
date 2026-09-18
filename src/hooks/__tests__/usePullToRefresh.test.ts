import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePullToRefresh } from '../usePullToRefresh';

describe('usePullToRefresh', () => {
  it('expone isRefreshing en false por defecto', () => {
    const { result } = renderHook(() => usePullToRefresh(vi.fn()));
    expect(result.current.isRefreshing).toBe(false);
  });

  it('llama onRefresh y actualiza isRefreshing durante la ejecución', async () => {
    let resolveRefresh: () => void;
    const onRefresh = vi.fn(() => new Promise<void>((r) => { resolveRefresh = r; }));
    const { result } = renderHook(() => usePullToRefresh(onRefresh));

    let triggerPromise: Promise<void>;
    act(() => {
      triggerPromise = result.current.triggerRefresh();
    });
    expect(result.current.isRefreshing).toBe(true);

    await act(async () => {
      resolveRefresh!();
      await triggerPromise;
    });

    expect(onRefresh).toHaveBeenCalled();
    expect(result.current.isRefreshing).toBe(false);
  });
});
