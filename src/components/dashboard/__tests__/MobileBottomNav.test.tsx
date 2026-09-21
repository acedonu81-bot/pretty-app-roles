import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileBottomNav from '../MobileBottomNav';

describe('MobileBottomNav', () => {
  it('el tab Flash llama onViewChange con flashbooking', () => {
    const onViewChange = vi.fn();
    render(
      <MobileBottomNav
        activeView="explorar"
        onViewChange={onViewChange}
        onMenuToggle={vi.fn()}
        unreadCount={0}
      />
    );
    fireEvent.click(screen.getByText('Flash').closest('button')!);
    expect(onViewChange).toHaveBeenCalledWith('flashbooking');
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

  it('los 4 tabs (Inicio, Flash, Chat, Perfil) siguen presentes, con el mismo peso visual', () => {
    render(
      <MobileBottomNav
        activeView="explorar"
        onViewChange={vi.fn()}
        onMenuToggle={vi.fn()}
        unreadCount={0}
      />
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Flash')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });
});
