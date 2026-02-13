/**
 * Haptic feedback hook — provides native iOS haptic responses.
 * DRY: centralizes all haptic interactions.
 * Safely no-ops on platforms that don't support haptics.
 */
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

export const useHaptics = () => {
  const light = useCallback(() => {
    if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const medium = useCallback(() => {
    if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const success = useCallback(() => {
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const warning = useCallback(() => {
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  const error = useCallback(() => {
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const selection = useCallback(() => {
    if (isIOS) Haptics.selectionAsync();
  }, []);

  return { light, medium, success, warning, error, selection };
};
