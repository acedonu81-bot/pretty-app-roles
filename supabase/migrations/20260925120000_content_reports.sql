-- ════════════════════════════════════════════════════════════════
-- Reportar contenido de usuario (mensajes y reseñas públicas).
--
-- Apple (Guideline 2.1, respuesta al envío del 9 sep 2026) exige que
-- cualquier app con contenido generado por usuario tenga "content
-- reporting and blocking mechanisms". El bloqueo de usuarios ya existía
-- (blocked_users, 20260708_messages_delete_block_users.sql); esto añade
-- la pieza que faltaba: reportar un mensaje o una reseña concretos para
-- que el admin los revise. Mínimo viable: guarda el reporte, no hay
-- panel de admin dedicado todavía (se revisa por SQL hasta que se
-- priorice una UI).
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('message', 'review')),
  content_id uuid NOT NULL,
  reported_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reporter_id, content_type, content_id)
);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- El autor del reporte puede ver sus propios reportes; el admin los ve todos.
DROP POLICY IF EXISTS "Reporter and admin can view reports" ON public.content_reports;
CREATE POLICY "Reporter and admin can view reports"
  ON public.content_reports FOR SELECT TO authenticated
  USING (reporter_id = auth.uid() OR public.es_admin());

DROP POLICY IF EXISTS "Users can report content" ON public.content_reports;
CREATE POLICY "Users can report content"
  ON public.content_reports FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- Solo el admin puede actualizar el estado (marcar revisado/descartado).
DROP POLICY IF EXISTS "Admin can update report status" ON public.content_reports;
CREATE POLICY "Admin can update report status"
  ON public.content_reports FOR UPDATE TO authenticated
  USING (public.es_admin())
  WITH CHECK (public.es_admin());

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON public.content_reports (status) WHERE status = 'pending';
