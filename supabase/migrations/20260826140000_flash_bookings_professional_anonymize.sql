-- ════════════════════════════════════════════════════════════════
-- Permite a un profesional anonimizar su propia referencia en
-- flash_bookings al borrar su cuenta (RGPD Art. 17).
--
-- Bug encontrado en handleDeleteAccount (SettingsView.tsx): al eliminar
-- la cuenta solo se borraban las filas donde el usuario es created_by
-- (empresario). Las filas donde es professional_user_id (el caso más
-- común — cualquier DJ/staff/etc. contratado) quedaban intactas con su
-- nombre real (professional_name) para siempre, pese a que la UI
-- prometía "todos tus datos personales han sido suprimidos". No se
-- pueden borrar esas filas sin más porque también pertenecen al
-- historial/contabilidad del empresario que las creó — la solución
-- correcta es anonimizar el nombre y desvincular el user_id.
--
-- La policy "Professional can update own flash bookings" ya existente
-- no cubre esto: su WITH CHECK exige que professional_user_id siga
-- siendo auth.uid() tras el update, lo que bloquearía poner NULL.
-- ════════════════════════════════════════════════════════════════

CREATE POLICY "Professional can anonymize own booking on account deletion"
  ON public.flash_bookings FOR UPDATE TO authenticated
  USING  (professional_user_id = auth.uid())
  WITH CHECK (professional_user_id IS NULL AND professional_name = 'Profesional eliminado');
