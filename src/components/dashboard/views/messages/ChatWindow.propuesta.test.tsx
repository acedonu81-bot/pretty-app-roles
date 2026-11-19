import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import ChatWindow from './ChatWindow';
import { mensajeAcepto } from '@/lib/acuerdoChat';

vi.mock('./AdjuntoChat', () => ({ default: () => null }));

const cond = { fecha: '2027-01-20', ciudad: 'Madrid', precio: '400', evento: '' };
const msg = (id: string, sender_id: string, content: string) => ({ id, sender_id, content, read: true, created_at: new Date().toISOString() });
const pinta = (messages: ReturnType<typeof msg>[]) => render(
  <ChatWindow messages={messages} userId="yo" activeOtherName="Ana" input="" setInput={() => {}} sending={false}
    uploadingPhoto={false} bottomRef={createRef()} fileInputRef={createRef()} onSend={() => {}} onPhotoUpload={() => {}}
    onBack={() => {}} onAcepto={() => {}} />,
);

describe('Proponer y aceptar en el chat', () => {
  it('sin nada pendiente el botón es Proponer', () => {
    pinta([]);
    expect(screen.getByTitle('Proponer fecha, ciudad y precio').textContent).toContain('Proponer');
  });
  it('la propuesta del otro se ve como propuesta y el botón es ACEPTO', () => {
    pinta([msg('1', 'ana', mensajeAcepto(cond))]);
    expect(screen.getByText('Propuesta de Ana')).toBeTruthy();
    expect(screen.getByText('ACEPTO')).toBeTruthy();
  });
  it('mi propuesta espera a la otra parte', () => {
    pinta([msg('1', 'yo', mensajeAcepto(cond))]);
    expect(screen.getByText('Tu propuesta de acuerdo')).toBeTruthy();
    expect(screen.getByText('Falta que Ana la acepte')).toBeTruthy();
    expect(screen.getByText('Enviada')).toBeTruthy();
  });
  it('cerrado: la propuesta sale aceptada, no sustituida', () => {
    pinta([msg('1', 'ana', mensajeAcepto(cond)), msg('2', 'yo', mensajeAcepto(cond))]);
    expect(screen.getByText('Aceptada por ti')).toBeTruthy();
    expect(screen.getByText('Has aceptado la propuesta')).toBeTruthy();
    expect(screen.queryByText('Sustituida por otra propuesta')).toBeNull();
    expect(screen.getByText('Conectados')).toBeTruthy();
  });
});
