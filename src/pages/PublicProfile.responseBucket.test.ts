import { describe, it, expect } from 'vitest';
import { responseBucketLabel } from './PublicProfile';

describe('responseBucketLabel', () => {
  it('returns null when there is no bucket', () => {
    expect(responseBucketLabel(null)).toBeNull();
  });

  it('maps each bucket to its Spanish label', () => {
    expect(responseBucketLabel('minutos')).toBe('Responde en minutos');
    expect(responseBucketLabel('menos_1h')).toBe('Responde en menos de 1 hora');
    expect(responseBucketLabel('unas_horas')).toBe('Responde en unas horas');
    expect(responseBucketLabel('1_dia')).toBe('Responde en 1 día');
    expect(responseBucketLabel('mas_1_dia')).toBe('Suele tardar en responder');
  });

  it('returns null for an unrecognized bucket', () => {
    expect(responseBucketLabel('bucket_invalido')).toBeNull();
  });
});
