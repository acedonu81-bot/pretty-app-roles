import { useEffect, useState, useCallback } from 'react';

export interface CartItem {
  userId: string;
  displayName: string;
  role: string;
  photoUrl: string | null;
  hourlyRate: number | null;
  zone: string | null;
}

const STORAGE_KEY = 'xpeak_event_cart';
const CHANGE_EVENT = 'xpeak-cart-change';
// Un organizador real contrata un puñado de profesionales por evento, no
// decenas — un tope evita que "Mi evento" se llene por error de swipes/clics
// repetidos y que el checkout dispare demasiadas solicitudes de golpe.
export const MAX_CART_ITEMS = 8;

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export type AddToCartResult = 'added' | 'duplicate' | 'limit_reached';

export function addToCart(item: CartItem): AddToCartResult {
  const items = readCart();
  if (items.some(i => i.userId === item.userId)) return 'duplicate';
  if (items.length >= MAX_CART_ITEMS) return 'limit_reached';
  writeCart([...items, item]);
  return 'added';
}

export function removeFromCart(userId: string) {
  writeCart(readCart().filter(i => i.userId !== userId));
}

export function clearCart() {
  writeCart([]);
}

export function isInCart(userId: string): boolean {
  return readCart().some(i => i.userId === userId);
}

/** Hook reactivo: se actualiza en todas las instancias cuando el carrito cambia (misma pestaña o entre pestañas). */
export function useEventCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  useEffect(() => {
    const onChange = () => setItems(readCart());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const add = useCallback((item: CartItem) => { addToCart(item); }, []);
  const remove = useCallback((userId: string) => { removeFromCart(userId); }, []);
  const clear = useCallback(() => { clearCart(); }, []);

  return { items, add, remove, clear, count: items.length };
}
