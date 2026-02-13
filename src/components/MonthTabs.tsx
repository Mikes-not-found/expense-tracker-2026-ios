/**
 * MonthTabs — horizontal scrollable month selector.
 * Mirrors the PWA's nav-tabs scroll behavior.
 */
import React, { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { months, monthShortNames, type MonthKey } from '../constants/categories';
import { makeStyles } from '../utils/styles';

interface MonthTabsProps {
  activeMonth: MonthKey;
  onSelect: (month: MonthKey) => void;
}

export const MonthTabs: React.FC<MonthTabsProps> = ({ activeMonth, onSelect }) => {
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);

  // Scroll active tab into view
  useEffect(() => {
    const idx = months.indexOf(activeMonth);
    if (idx >= 0 && scrollRef.current) {
      // Approximate width per tab: ~60px
      scrollRef.current.scrollTo({ x: Math.max(0, idx * 60 - 120), animated: true });
    }
  }, [activeMonth]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {months.map((m) => {
          const isActive = m === activeMonth;
          return (
            <TouchableOpacity
              key={m}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onSelect(m)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {monthShortNames[m]}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    backgroundColor: t.colors.bgBase,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  scroll: {
    paddingHorizontal: t.spacing.md,
    gap: t.spacing.xs,
    alignItems: 'center',
    height: 48,
  },
  tab: {
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    borderRadius: t.radius.sm,
    position: 'relative',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: t.colors.accentMuted,
  },
  tabText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.sm,
    color: t.colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: t.fonts.monoSemiBold,
    color: t.colors.accent,
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: t.colors.accent,
    borderRadius: 1,
  },
}));
