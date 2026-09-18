import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileBottomNav from '../MobileBottomNav';

describe('MobileBottomNav', () => {
  it('el FAB central llama onViewChange con flashbooking', () => {
    const onViewChange = vi.fn();
    render(
      <MobileBottomNav
        activeView="explorar"
        onViewChange={onViewChange}
        onMenuToggle={vi.fn()}
        unreadCount={0}
      />
    );
    const fab = screen.getByLabelText('¿Qué estás organizando?');
    fireEvent.click(fab);
    expect(onViewChange).toHaveBeenCalledWith('flashbooking');
  });

  it('el FAB no muestra texto/label visible, solo el icono', () => {
    render(
      <MobileBottomNav
        activeView="explorar"
        onViewChange={vi.fn()}
        onMenuToggle={vi.fn()}
        unreadCount={0}
      />
    );
    expect(screen.queryByText('Flash')).not.toBeInTheDocument();
  });

  it('el badge de chat muestra el número de no leídos', () => {
    render(
      <MobileBottomNav
        activeView="explorar"
        onViewChange={vi.fn()}
        onMenuToggle={vi.fn()}
        unreadCount={3}
      />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('el tab activo se marca con aria-current', () => {
    render(
      <MobileBottomNav
        activeView="profile"
        onViewChange={vi.fn()}
        onMenuToggle={vi.fn()}
        unreadCount={0}
      />
    );
    expect(screen.getByText('Perfil').closest('button')).toHaveAttribute('aria-current', 'true');
  });

  it('los 3 tabs normales (Inicio, Chat, Perfil) siguen presentes', () => {
    render(
      <MobileBottomNav
        activeView="explorar"
        onViewChange={vi.fn()}
        onMenuToggle={vi.fn()}
        unreadCount={0}
      />
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });
});
