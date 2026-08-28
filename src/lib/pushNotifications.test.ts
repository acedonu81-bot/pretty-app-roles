import { describe, expect, it, vi, beforeEach } from 'vitest';

const upsertMock = vi.fn().mockResolvedValue({ error: null });
const fromMock = vi.fn(() => ({ upsert: upsertMock }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: fromMock },
}));

// Stub mínimo de un PushSubscription real: toJSON() es lo único que
// pushNotifications.ts necesita leer.
const fakeSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
  toJSON: () => ({
    endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
    keys: { p256dh: 'fake-p256dh', auth: 'fake-auth' },
  }),
};

beforeEach(() => {
  upsertMock.mockClear();
  fromMock.mockClear();
  vi.stubGlobal('Notification', {
    requestPermission: vi.fn().mockResolvedValue('granted'),
    permission: 'granted',
  });
  vi.stubGlobal('navigator', {
    serviceWorker: {
      getRegistration: vi.fn().mockResolvedValue(null),
      register: vi.fn().mockResolvedValue({
        pushManager: { subscribe: vi.fn().mockResolvedValue(fakeSubscription) },
      }),
      ready: Promise.resolve(),
    },
  });
  vi.stubEnv('VITE_VAPID_PUBLIC_KEY', 'ZmFrZS12YXBpZC1rZXk'); // base64url válido, contenido irrelevante
});

describe('requestPushPermission', () => {
  it('guarda endpoint y claves de la suscripción real en push_subscriptions', async () => {
    const { requestPushPermission } = await import('./pushNotifications');
    const ok = await requestPushPermission('user-123');

    expect(ok).toBe(true);
    expect(fromMock).toHaveBeenCalledWith('push_subscriptions');
    expect(upsertMock).toHaveBeenCalledWith(
      {
        user_id: 'user-123',
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
        p256dh: 'fake-p256dh',
        auth: 'fake-auth',
      },
      { onConflict: 'endpoint' },
    );
  });
});

describe('revokePushPermission', () => {
  it('borra la fila por endpoint antes de desuscribir', async () => {
    const deleteEqMock = vi.fn().mockResolvedValue({ error: null });
    const unsubscribeMock = vi.fn().mockResolvedValue(true);
    fromMock.mockReturnValueOnce({ delete: () => ({ eq: deleteEqMock }) } as any);
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistration: vi.fn().mockResolvedValue({
          pushManager: {
            getSubscription: vi.fn().mockResolvedValue({
              endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
              unsubscribe: unsubscribeMock,
            }),
          },
        }),
      },
    });

    const { revokePushPermission } = await import('./pushNotifications');
    await revokePushPermission();

    expect(deleteEqMock).toHaveBeenCalledWith('endpoint', 'https://fcm.googleapis.com/fcm/send/abc123');
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
