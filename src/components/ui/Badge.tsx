/**
 * Badge — kawaii category chip with pink pill style and emoji.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { makeStyles } from '../../utils/styles';
import { categoryEmojis } from '../../constants/categories';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, bgColor }) => {
  const styles = useStyles();
  const emoji = categoryEmojis[label] ?? '';
  return (
    <View style={[styles.container, bgColor ? { backgroundColor: bgColor } : undefined]}>
      <Text style={[styles.text, color ? { color } : undefined]}>
        {emoji ? `${emoji} ${label}` : label}
      </Text>
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accentMuted,
    borderWidth: 1,
    borderColor: t.colors.border,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.accent,
  },
}));
