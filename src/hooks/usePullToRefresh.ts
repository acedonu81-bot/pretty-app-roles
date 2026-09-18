import { useCallback, useState } from 'react';

interface PullToRefreshResult {
  isRefreshing: boolean;
  triggerRefresh: () => Promise<void>;
}

/**
 * Lógica de estado de pull-to-refresh, desacoplada del gesto táctil en sí
 * (el gesto visual se implementa por listado consumidor con onTouchMove,
 * ya que cada listado tiene su propio contenedor de scroll). Este hook
 * centraliza solo el ciclo de vida de "refrescando sí/no".
 */
export function usePullToRefresh(onRefresh: () => Promise<void>): PullToRefreshResult {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  return { isRefreshing, triggerRefresh };
}
