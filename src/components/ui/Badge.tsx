/**
 * Badge — kawaii category chip with pink pill style and emoji.
 */
import React from 'react';
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
    <span style={{ ...styles.container, ...(bgColor ? { backgroundColor: bgColor } : {}) }}>
      <span style={{ ...styles.text, ...(color ? { color } : {}) }}>
        {emoji ? `${emoji} ${label}` : label}
      </span>
    </span>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    display: 'inline-flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accentMuted,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: t.colors.border,
  },
  text: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.accent,
  },
}));
