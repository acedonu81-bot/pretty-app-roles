-- ════════════════════════════════════════════════════════════════
-- Mensajería: eliminar chats/mensajes y bloquear usuarios.
--
-- conversations/messages nunca tuvieron migración propia (se crearon
-- desde el dashboard de Supabase antes de que arrancara el tracking
-- de migraciones en este repo) — esta migración es la primera vez
-- que su RLS queda versionado.
-- ════════════════════════════════════════════════════════════════

-- ── blocked_users (primero: las policies de messages la referencian) ──
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own blocks" ON public.blocked_users;
CREATE POLICY "Users can view own blocks"
  ON public.blocked_users FOR SELECT TO authenticated
  USING (blocker_id = auth.uid());

DROP POLICY IF EXISTS "Users can block others" ON public.blocked_users;
CREATE POLICY "Users can block others"
  ON public.blocked_users FOR INSERT TO authenticated
  WITH CHECK (blocker_id = auth.uid());

DROP POLICY IF EXISTS "Users can unblock others" ON public.blocked_users;
CREATE POLICY "Users can unblock others"
  ON public.blocked_users FOR DELETE TO authenticated
  USING (blocker_id = auth.uid());

-- ── conversations / messages ──────────────────────────────────────
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Soft-delete: un participante puede "salir" de la conversación sin
-- borrar el historial para el otro. deleted_by_a/deleted_by_b evita
-- que un DELETE físico rompa la vista del otro participante.
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS deleted_by_a boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_by_b boolean NOT NULL DEFAULT false;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- ── conversations: SELECT/UPDATE solo participantes ──────────────
DROP POLICY IF EXISTS "Participants can view their conversations" ON public.conversations;
CREATE POLICY "Participants can view their conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (auth.uid() IN (participant_a, participant_b));

DROP POLICY IF EXISTS "Participants can create conversations" ON public.conversations;
CREATE POLICY "Participants can create conversations"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (participant_a, participant_b));

DROP POLICY IF EXISTS "Participants can update their conversations" ON public.conversations;
CREATE POLICY "Participants can update their conversations"
  ON public.conversations FOR UPDATE TO authenticated
  USING (auth.uid() IN (participant_a, participant_b))
  WITH CHECK (auth.uid() IN (participant_a, participant_b));

-- ── messages: SELECT solo participantes de la conversación ───────
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.participant_a, c.participant_b)
    )
  );

DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.participant_a, c.participant_b)
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users b
      JOIN public.conversations c ON c.id = conversation_id
      WHERE (b.blocker_id = c.participant_a AND b.blocked_id = c.participant_b)
         OR (b.blocker_id = c.participant_b AND b.blocked_id = c.participant_a)
    )
  );

DROP POLICY IF EXISTS "Participants can update own messages" ON public.messages;
CREATE POLICY "Participants can update own messages"
  ON public.messages FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.participant_a, c.participant_b)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.participant_a, c.participant_b)
    )
  );

-- Borrado de mensaje individual = soft-delete vía UPDATE deleted_at,
-- solo el propio autor (no el otro participante).
DROP POLICY IF EXISTS "Sender can soft-delete own message" ON public.messages;
CREATE POLICY "Sender can soft-delete own message"
  ON public.messages FOR UPDATE TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());
