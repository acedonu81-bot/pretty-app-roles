import { describe, expect, it, vi } from 'vitest';
import { IR_A_VISTA_EVENT, irAVista } from './irAVista';

// Un componente hijo del Dashboard no puede cambiar la pestaña activa con solo
// navigate(): la vista vive en el estado interno del Dashboard y la URL se lee
// una vez al cargar. Esta función se lo pide al Dashboard por evento.
describe('irAVista', () => {
  it('emite el evento con la vista y la URL de destino', () => {
    const oyente = vi.fn();
    window.addEventListener(IR_A_VISTA_EVENT, oyente as EventListener);
    irAVista('empresario', '/dashboard?view=empresario&tab=historial');
    window.removeEventListener(IR_A_VISTA_EVENT, oyente as EventListener);

    expect(oyente).toHaveBeenCalledTimes(1);
    const detalle = (oyente.mock.calls[0][0] as CustomEvent).detail;
    expect(detalle).toEqual({ vista: 'empresario', url: '/dashboard?view=empresario&tab=historial' });
  });

  it('la URL es opcional', () => {
    const oyente = vi.fn();
    window.addEventListener(IR_A_VISTA_EVENT, oyente as EventListener);
    irAVista('messages');
    window.removeEventListener(IR_A_VISTA_EVENT, oyente as EventListener);
    expect((oyente.mock.calls[0][0] as CustomEvent).detail).toEqual({ vista: 'messages', url: undefined });
  });
});
