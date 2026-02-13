/**
 * Badge — category chip / tag component.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { createStyles } from '../../utils/styles';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  bgColor,
}) => (
  <View style={[styles.container, bgColor ? { backgroundColor: bgColor } : undefined]}>
    <Text style={[styles.text, color ? { color } : undefined]}>{label}</Text>
  </View>
);

const styles = createStyles((t) => ({
  container: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accentMuted,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: t.fonts.monoSemiBold,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.accent,
  },
}));
