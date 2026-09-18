import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/capacitor', () => ({ isNative: true }));

import { NativeStackTransition } from '../NativeStackTransition';

// isNative=true es el camino donde vive toda la lógica real (AnimatePresence,
// variants, custom, key) — separado en su propio archivo porque vi.mock está
// hoisted a nivel de módulo y no se puede alternar isNative entre tests del
// mismo fichero.
describe('NativeStackTransition en nativo (isNative=true)', () => {
  it('renderiza los children igualmente (el contenido no desaparece)', () => {
    render(
      <NativeStackTransition activeKey="explorar" direction="forward">
        <div data-testid="content">contenido</div>
      </NativeStackTransition>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('al cambiar activeKey, el contenido nuevo se muestra', () => {
    const { rerender: rerenderView } = render(
      <NativeStackTransition activeKey="explorar" direction="forward">
        <div data-testid="content">explorar</div>
      </NativeStackTransition>
    );
    expect(screen.getByText('explorar')).toBeInTheDocument();

    rerenderView(
      <NativeStackTransition activeKey="dj" direction="forward">
        <div data-testid="content">dj</div>
      </NativeStackTransition>
    );
    expect(screen.getByText('dj')).toBeInTheDocument();
  });
});
