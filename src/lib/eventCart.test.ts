import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { addToCart, removeFromCart, clearCart, isInCart, useEventCart, MAX_CART_ITEMS, type CartItem } from './eventCart';

function makeItem(userId: string, overrides: Partial<CartItem> = {}): CartItem {
  return {
    userId,
    displayName: `Profesional ${userId}`,
    role: 'dj',
    photoUrl: null,
    hourlyRate: 80,
    zone: 'Madrid',
    ...overrides,
  };
}

describe('eventCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('addToCart', () => {
    it('adds a new item and returns "added"', () => {
      const result = addToCart(makeItem('pro-1'));
      expect(result).toBe('added');
      expect(isInCart('pro-1')).toBe(true);
    });

    it('returns "duplicate" and does not add the same professional twice', () => {
      addToCart(makeItem('pro-1'));
      const result = addToCart(makeItem('pro-1'));
      expect(result).toBe('duplicate');

      const { result: hook } = renderHook(() => useEventCart());
      expect(hook.current.count).toBe(1);
    });

    it('returns "limit_reached" once MAX_CART_ITEMS is hit, without adding the item', () => {
      for (let i = 0; i < MAX_CART_ITEMS; i++) {
        expect(addToCart(makeItem(`pro-${i}`))).toBe('added');
      }

      const result = addToCart(makeItem('pro-overflow'));
      expect(result).toBe('limit_reached');
      expect(isInCart('pro-overflow')).toBe(false);

      const { result: hook } = renderHook(() => useEventCart());
      expect(hook.current.count).toBe(MAX_CART_ITEMS);
    });
  });

  describe('removeFromCart', () => {
    it('removes only the targeted professional, keeping the rest', () => {
      addToCart(makeItem('pro-1'));
      addToCart(makeItem('pro-2'));
      addToCart(makeItem('pro-3'));

      removeFromCart('pro-2');

      expect(isInCart('pro-1')).toBe(true);
      expect(isInCart('pro-2')).toBe(false);
      expect(isInCart('pro-3')).toBe(true);
    });

    it('is a no-op when removing a professional that is not in the cart', () => {
      addToCart(makeItem('pro-1'));
      removeFromCart('does-not-exist');

      const { result: hook } = renderHook(() => useEventCart());
      expect(hook.current.count).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('empties the cart entirely', () => {
      addToCart(makeItem('pro-1'));
      addToCart(makeItem('pro-2'));

      clearCart();

      const { result: hook } = renderHook(() => useEventCart());
      expect(hook.current.count).toBe(0);
      expect(hook.current.items).toEqual([]);
    });
  });

  describe('useEventCart (reactive hook)', () => {
    it('reflects changes made through the module functions without a manual refetch', () => {
      const { result: hook } = renderHook(() => useEventCart());
      expect(hook.current.count).toBe(0);

      act(() => {
        hook.current.add(makeItem('pro-1'));
      });
      expect(hook.current.count).toBe(1);

      act(() => {
        hook.current.remove('pro-1');
      });
      expect(hook.current.count).toBe(0);
    });

    it('empties and the widget/modal state goes back to zero after removing the last item', () => {
      const { result: hook } = renderHook(() => useEventCart());

      act(() => { hook.current.add(makeItem('pro-1')); });
      act(() => { hook.current.add(makeItem('pro-2')); });
      expect(hook.current.count).toBe(2);

      act(() => { hook.current.remove('pro-1'); });
      act(() => { hook.current.remove('pro-2'); });

      expect(hook.current.count).toBe(0);
      expect(hook.current.items).toEqual([]);
    });

    it('two hook instances (e.g. floating widget + checkout modal) stay in sync', () => {
      const { result: widget } = renderHook(() => useEventCart());
      const { result: modal } = renderHook(() => useEventCart());

      act(() => {
        widget.current.add(makeItem('pro-1'));
      });

      expect(widget.current.count).toBe(1);
      expect(modal.current.count).toBe(1);
    });
  });

  describe('persistence across reads', () => {
    it('survives being read again from a fresh call (simulates a page reload)', () => {
      addToCart(makeItem('pro-1', { displayName: 'Daniel Torrez', hourlyRate: 80 }));

      const { result: hook } = renderHook(() => useEventCart());
      expect(hook.current.items).toEqual([
        expect.objectContaining({ userId: 'pro-1', displayName: 'Daniel Torrez', hourlyRate: 80 }),
      ]);
    });

    it('ignores corrupted localStorage content instead of throwing', () => {
      localStorage.setItem('xpeak_event_cart', 'not valid json{{{');

      const { result: hook } = renderHook(() => useEventCart());
      expect(hook.current.items).toEqual([]);
    });
  });
});
