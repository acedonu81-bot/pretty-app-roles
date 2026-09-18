import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/capacitor', () => ({ isNative: false }));

import { NativeStackTransition } from '../NativeStackTransition';

describe('NativeStackTransition en web', () => {
  it('renderiza los hijos sin wrapper de animación', () => {
    render(
      <NativeStackTransition activeKey="explorar" direction="forward">
        <div data-testid="content">contenido</div>
      </NativeStackTransition>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
