-- ════════════════════════════════════════════════════════════════
-- Restaura permiso de cancelación para empresarios en flash_bookings.
--
-- La migración 20260602_fix_flash_bookings_update_idor.sql quitó por
-- completo el UPDATE de "created_by" (empleador) para cerrar un IDOR
-- que permitía al empleador cambiar el status a cualquier valor,
-- incluido 'confirmed'/'completed' sin que el profesional lo aceptara.
-- Pero ninguna migración posterior devolvió al empleador la capacidad
-- de cancelar SU PROPIA solicitud pendiente — HistorialTab.tsx sigue
-- mostrando un botón "Cancelar" que siempre falla por RLS (confirmado
-- con auditoría real en xpeak.es el 26 ago 2026).
--
-- Fix: nueva policy estrecha — el empleador solo puede pasar SU PROPIA
-- solicitud de 'pending' a 'cancelled', nunca a otro status. El IDOR
-- original (empleador confirmando/completando bookings) sigue cerrado.
-- ════════════════════════════════════════════════════════════════

CREATE POLICY "Employer can cancel own pending flash bookings"
  ON public.flash_bookings FOR UPDATE TO authenticated
  USING  (created_by = auth.uid() AND status = 'pending')
  WITH CHECK (created_by = auth.uid() AND status = 'cancelled');
