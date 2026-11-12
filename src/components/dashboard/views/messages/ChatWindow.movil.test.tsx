import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import ChatWindow from './ChatWindow';

vi.mock('./AdjuntoChat', () => ({ default: () => null }));

const base = {
  messages: [{ id: 'm1', sender_id: 'yo', content: 'Hola', read: true, created_at: new Date().toISOString() }],
  userId: 'yo', activeOtherName: 'Ana', input: '', setInput: () => {}, sending: false, uploadingPhoto: false,
  bottomRef: createRef<HTMLDivElement>(), fileInputRef: createRef<HTMLInputElement>(),
  onSend: vi.fn(), onPhotoUpload: () => {}, onBack: () => {}, onDeleteMessage: vi.fn(),
};

describe('ChatWindow en el móvil', () => {
  it('la papelera no se puede pulsar hasta tocar el mensaje', () => {
    render(<ChatWindow {...base} />);
    const papelera = screen.getByLabelText('Eliminar mensaje');
    expect(papelera.style.pointerEvents).toBe('none');
    fireEvent.click(screen.getByText('Hola'));
    expect(papelera.style.pointerEvents).toBe('auto');
    fireEvent.click(papelera);
    expect(screen.getByText('Se eliminará para ambos. Esta acción no se puede deshacer.')).toBeTruthy();
  });

  it('la caja de escribir es de varias líneas y Intro envía en escritorio', () => {
    const onSend = vi.fn();
    render(<ChatWindow {...base} input="hola" onSend={onSend} />);
    const caja = screen.getByPlaceholderText('Escribe un mensaje');
    expect(caja.tagName).toBe('TEXTAREA');
    fireEvent.keyDown(caja, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(caja, { key: 'Enter', shiftKey: true });
    expect(onSend).toHaveBeenCalledTimes(1);
  });
});
