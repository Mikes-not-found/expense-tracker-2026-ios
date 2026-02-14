/**
 * MonthTabs — kawaii horizontal month selector with emoji and pink active tab.
 */
import React, { useRef, useEffect } from 'react';
import { months, monthShortNames, monthEmojis, type MonthKey } from '../constants/categories';
import { makeStyles } from '../utils/styles';

interface MonthTabsProps {
  activeMonth: MonthKey;
  onSelect: (month: MonthKey) => void;
}

export const MonthTabs: React.FC<MonthTabsProps> = ({ activeMonth, onSelect }) => {
  const styles = useStyles();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = months.indexOf(activeMonth);
    if (idx >= 0 && scrollRef.current) {
      scrollRef.current.scrollTo({ left: Math.max(0, idx * 78 - 120), behavior: 'smooth' });
    }
  }, [activeMonth]);

  return (
    <div style={styles.container}>
      <div ref={scrollRef} style={styles.scroll}>
        {months.map((m) => {
          const isActive = m === activeMonth;
          return (
            <div
              key={m}
              style={{ ...styles.tab, ...(isActive ? styles.tabActive : {}) }}
              onClick={() => onSelect(m)}
            >
              <span style={styles.tabEmoji}>{monthEmojis[m]}</span>
              <span style={{ ...styles.tabText, ...(isActive ? styles.tabTextActive : {}) }}>
                {monthShortNames[m]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    backgroundColor: t.colors.bgSurface,
    borderBottomWidth: 1.5,
    borderBottomStyle: 'solid',
    borderBottomColor: t.colors.border,
  },
  scroll: {
    display: 'flex',
    overflowX: 'auto' as const,
    paddingLeft: t.spacing.md,
    paddingRight: t.spacing.md,
    gap: t.spacing.xs,
    alignItems: 'center',
    height: 60,
    scrollbarWidth: 'none' as const,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.sm,
    paddingLeft: t.spacing.md + 2,
    paddingRight: t.spacing.md + 2,
    borderRadius: t.radius.full,
    cursor: 'pointer',
    flexShrink: 0,
    WebkitTapHighlightColor: 'transparent',
  },
  tabActive: {
    backgroundColor: t.colors.accent,
  },
  tabEmoji: {
    fontSize: 14,
  },
  tabText: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    color: '#ffffff',
  },
}));
