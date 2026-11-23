-- 19 nov 2026: pulsar ACEPTO en el chat no es firmar un contrato ni cerrar un
-- trabajo: los dos confirman que quieren seguir adelante y quedan "conectados"
-- (decisión de Daniel). Cambia solo las frases de los avisos (campana y push) en
-- las cuatro funciones que las escriben. Reejecutable: si la frase ya no está, no
-- hace nada.
DO $$
DECLARE
  f record;
  def text;
BEGIN
  FOR f IN
    SELECT p.oid
      FROM pg_proc p
     WHERE p.pronamespace = 'public'::regnamespace
       AND p.proname IN ('cerrar_acuerdo_chat', 'texto_aviso_acuerdo', 'create_message_notification', 'notify_new_message')
  LOOP
    def := pg_get_functiondef(f.oid);
    def := replace(def, 'Acuerdo cerrado con ', 'Conectados con ');
    def := replace(def, 'Ha aceptado tu propuesta. Acuerdo cerrado', 'Ha aceptado tu propuesta. Ya estáis conectados');
    def := replace(def, 'Te ha enviado una propuesta de contrato', 'Quiere seguir adelante contigo');
    def := replace(def, 'Ha aceptado el contrato', 'Ha aceptado tu propuesta');
    def := replace(def, 'Te propone un acuerdo para el ', 'Quiere seguir adelante el ');
    def := replace(def, 'Te propone un acuerdo', 'Quiere seguir adelante');
    EXECUTE def;
  END LOOP;
END $$;
