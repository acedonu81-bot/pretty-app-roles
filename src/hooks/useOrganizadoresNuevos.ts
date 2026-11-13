import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Aviso luminoso de "Organizadores" en el menú (13 nov 2026): se enciende cuando
// aparece un organizador que este profesional aún no ha visto, y se apaga al abrir
// la sección. Los ids vistos se guardan en este dispositivo, igual que Flash Booking.

/** Cuenta oficial de XPEAK: no es un organizador real, no sale en el listado. */
export const CUENTA_OFICIAL_XPEAK = 'b8c47c26-33bd-41d7-a869-ba6fa2d22667';

const EVENTO = 'xpeak:organizadores-vistos';
const clave = (uid: string) => `xpeak_organizadores_vistos_${uid}`;

function leer(uid: string): Set<string> {
  try {
    const crudo = JSON.parse(localStorage.getItem(clave(uid)) ?? '[]');
    return new Set(Array.isArray(crudo) ? crudo.map(String) : []);
  } catch { return new Set(); }
}

/** Marca como vistos estos organizadores y apaga el aviso del menú. */
export function marcarOrganizadoresVistos(uid: string, ids: string[]): void {
  const vistos = leer(uid);
  ids.forEach(id => vistos.add(id));
  try { localStorage.setItem(clave(uid), JSON.stringify([...vistos])); } catch { /* sin almacenamiento */ }
  window.dispatchEvent(new Event(EVENTO));
}

/** Cuántos organizadores hay sin ver. `activo` = solo los profesionales ven la sección. */
export function useOrganizadoresNuevos(uid: string | undefined, activo: boolean): number {
  const [n, setN] = useState(0);
  const cargar = useCallback(async () => {
    if (!uid || !activo) { setN(0); return; }
    const { data } = await (supabase.rpc as any)('organizadores_visibles');
    const ids = ((data ?? []) as { user_id: string }[]).map(o => o.user_id).filter(id => id !== CUENTA_OFICIAL_XPEAK);
    const vistos = leer(uid);
    setN(ids.filter(id => !vistos.has(id)).length);
  }, [uid, activo]);
  useEffect(() => {
    void cargar();
    window.addEventListener(EVENTO, cargar);
    return () => window.removeEventListener(EVENTO, cargar);
  }, [cargar]);
  return n;
}
