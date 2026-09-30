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
    const parsed = raw ? JSON.parse(raw) : [];
    // Un valor corrupto o de una versión antigua no puede tumbar la página.
    return Array.isArray(parsed) ? parsed.filter(i => i && typeof i.userId === 'string') : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  // Safari en modo privado o con el almacenamiento lleno lanza aquí: sin el
  // try, el clic en "Añadir a mi evento" rompía sin avisar.
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* sin persistencia */ }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/** El equipo de alquiler cobra por día; el resto de oficios, por hora. */
export const cobraPorDia = (item: Pick<CartItem, 'role'>) => item.role === 'alquiler';

/** Importe estimado de un profesional del carrito para un evento de `horas` horas. */
export function importeEstimado(item: CartItem, horas: number): number {
  if (!item.hourlyRate) return 0;
  return cobraPorDia(item) ? item.hourlyRate : item.hourlyRate * horas;
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
