// Cuentas de autocontrato/demo para la revisión de Apple (ver memoria del
// proyecto: demo.organizador@ / demo.profesional@xpeak.es generan
// actividad fake, no clientes reales) — nunca deben recibir emails
// automáticos de producto como este recordatorio.
export function isDemoAccount(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.startsWith('demo.') && normalized.endsWith('@xpeak.es');
}
