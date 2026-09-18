import { isRouteBlockedInNative } from './nativeEntry';

export function shouldRegisterRoute(pathname: string, native: boolean): boolean {
  if (!native) return true;
  return !isRouteBlockedInNative(pathname);
}
