-- El contrato descargado no era el mismo que se firmó.
--
-- Había DOS generadores de PDF distintos para el mismo contrato:
--   · ContractModal  — el que se firma. 10 estipulaciones.
--   · ContractView   — el que se re-descarga del historial. 6 estipulaciones.
--
-- Y no solo eran distintos: se contradecían sobre la MISMA referencia
-- XPEAK-XXXXXX. Cancelación: uno dice "7-15 días: 50%, menos de 7: 100%"; el
-- otro "menos de 48h: 50%". Plazo de pago: uno "N días desde factura", el otro
-- "antes o en el momento de la prestación". Dos documentos incompatibles sobre
-- el mismo acuerdo entre dos personas.
--
-- Se guarda el HTML tal y como se firmó y el historial re-sirve ESE, en vez de
-- volver a generar uno nuevo. Un contrato no se regenera: se conserva.
ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS contract_html text,
  -- Sello de cuándo se firmó, para poder distinguir un contrato firmado de un
  -- borrador guardado si más adelante se permite guardar sin firmar.
  ADD COLUMN IF NOT EXISTS signed_at timestamptz;

COMMENT ON COLUMN public.contracts.contract_html IS
  'El documento tal y como se firmó. El historial sirve esto, nunca lo regenera: regenerarlo puede producir un texto distinto al que las partes aceptaron.';

-- La referencia identifica el documento: no puede repetirse. Se generaba con
-- los últimos 6 caracteres en base36 de Date.now(), que se repiten cada ~2
-- días, y la tabla no tenía UNIQUE.
CREATE UNIQUE INDEX IF NOT EXISTS contracts_ref_unique ON public.contracts (ref);
