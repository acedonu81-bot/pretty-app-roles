/**
 * Ciudad con la que arranca el asistente de alta. El registro con correo ya
 * pide la ciudad y la guarda en profiles.zone; el asistente la volvía a pedir
 * y bloqueaba "Guardar y continuar" hasta elegirla otra vez (17 nov 2026).
 * 'España' es el valor sin ciudad real (mismo criterio que WizardGate).
 */
export function ciudadInicial(
  zona: string | null | undefined,
  ciudades: readonly string[],
): { city: string; customCity: string } {
  const z = (zona ?? '').trim();
  if (!z || ['españa', 'otra ciudad'].includes(z.toLowerCase())) return { city: '', customCity: '' };
  const conocida = ciudades.find(c => c !== 'Otra ciudad' && c.toLowerCase() === z.toLowerCase());
  return conocida ? { city: conocida, customCity: '' } : { city: 'Otra ciudad', customCity: z };
}
