import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const rpc = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a) } }));

import AdminAcuerdos from './AdminAcuerdos';

describe('AdminAcuerdos', () => {
  beforeEach(() => rpc.mockReset());

  it('pinta las cifras de la comparación', async () => {
    rpc.mockResolvedValue({ data: [{ preguntadas: 12, ambos_si: 4, solo_uno_si: 3, ambos_no: 2, sin_respuesta: 3, eventos_xpeak: 5, eventos_fuera: 20 }], error: null });
    render(<AdminAcuerdos />);
    expect(await screen.findByText('Acuerdos cerrados desde XPEAK')).toBeTruthy();
    for (const [etiqueta, valor] of [['Contrataciones preguntadas', '12'], ['Las dos partes dicen que sí', '4'], ['Solo una parte dice que sí', '3'],
      ['Las dos partes dicen que no', '2'], ['Sin respuesta', '3'], ['Eventos de trayectorias con contrato XPEAK', '5'], ['Eventos de trayectorias de fuera', '20']]) {
      expect(screen.getByText(etiqueta).parentElement?.textContent).toContain(valor);
    }
    expect(rpc).toHaveBeenCalledWith('acuerdos_comparacion');
  });

  it('sin datos pinta ceros, no vacío', async () => {
    rpc.mockResolvedValue({ data: [{ preguntadas: 0, ambos_si: 0, solo_uno_si: 0, ambos_no: 0, sin_respuesta: 0, eventos_xpeak: 0, eventos_fuera: 0 }], error: null });
    render(<AdminAcuerdos />);
    await screen.findByText('Acuerdos cerrados desde XPEAK');
    expect(screen.getByText('Contrataciones preguntadas').parentElement?.textContent).toContain('0');
  });

  it('si la consulta falla (no eres admin) no pinta nada', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'Solo admin' } });
    const { container } = render(<AdminAcuerdos />);
    await new Promise(r => setTimeout(r, 20));
    expect(container.firstChild).toBeNull();
  });
});
