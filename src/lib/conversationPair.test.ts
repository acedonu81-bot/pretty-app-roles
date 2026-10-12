import { describe, it, expect } from 'vitest';
import { conversationPair } from './conversationPair';

describe('conversationPair', () => {
  const ana = '11111111-1111-1111-1111-111111111111';
  const beto = '22222222-2222-2222-2222-222222222222';

  it('ordena la pareja igual que el trigger de contratación (LEAST/GREATEST)', () => {
    expect(conversationPair(ana, beto)).toEqual({ a: ana, b: beto });
    expect(conversationPair(beto, ana)).toEqual({ a: ana, b: beto });
  });

  it('no deja abrir un chat con uno mismo', () => {
    expect(conversationPair(ana, ana)).toBeNull();
  });

  it('no deja abrir un chat sin las dos personas', () => {
    expect(conversationPair(ana, '')).toBeNull();
    expect(conversationPair('', beto)).toBeNull();
  });
});
