/**
 * MonthTabs — kawaii horizontal month selector with emoji and pink active tab.
 */
import React, { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { months, monthShortNames, monthEmojis, type MonthKey } from '../constants/categories';
import { makeStyles } from '../utils/styles';

interface MonthTabsProps {
  activeMonth: MonthKey;
  onSelect: (month: MonthKey) => void;
}

export const MonthTabs: React.FC<MonthTabsProps> = ({ activeMonth, onSelect }) => {
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const idx = months.indexOf(activeMonth);
    if (idx >= 0 && scrollRef.current) {
      scrollRef.current.scrollTo({ x: Math.max(0, idx * 78 - 120), animated: true });
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
              <Text style={styles.tabEmoji}>{monthEmojis[m]}</Text>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {monthShortNames[m]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    backgroundColor: t.colors.bgSurface,
    borderBottomWidth: 1.5,
    borderBottomColor: t.colors.border,
  },
  scroll: {
    paddingHorizontal: t.spacing.md,
    gap: t.spacing.xs,
    alignItems: 'center',
    height: 60,
  },
  tab: {
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md + 2,
    borderRadius: t.radius.full,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  tabActive: {
    backgroundColor: t.colors.accent,
  },
  tabEmoji: {
    fontSize: 14,
  },
  tabText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: t.fonts.monoBold,
    color: '#ffffff',
  },
}));
