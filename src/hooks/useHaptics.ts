/**
 * Haptic feedback hook — web version.
 * Uses navigator.vibrate() where available, otherwise no-op.
 */
import { useCallback } from 'react';

const vibrate = (ms: number) => {
  if (navigator.vibrate) navigator.vibrate(ms);
};

export const useHaptics = () => {
  const light = useCallback(() => vibrate(10), []);
  const medium = useCallback(() => vibrate(20), []);
  const success = useCallback(() => vibrate(30), []);
  const warning = useCallback(() => vibrate(40), []);
  const error = useCallback(() => vibrate(50), []);
  const selection = useCallback(() => vibrate(5), []);

  return { light, medium, success, warning, error, selection };
};
