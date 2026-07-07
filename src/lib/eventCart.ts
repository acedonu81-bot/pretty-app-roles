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

export function addToCart(item: CartItem) {
  const items = readCart();
  if (items.some(i => i.userId === item.userId)) return false;
  writeCart([...items, item]);
  return true;
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

  const estimatedTotal = items.reduce((sum, i) => sum + (i.hourlyRate ?? 0), 0);

  return { items, add, remove, clear, count: items.length, estimatedTotal };
}
