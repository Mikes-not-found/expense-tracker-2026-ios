/**
 * FilterBar — kawaii dashboard filter triggers with pink pill style.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { monthShortNames, type MonthKey } from '../constants/categories';
import { makeStyles } from '../utils/styles';
import { formatEuro } from '../utils/calculations';

interface FilterBarProps {
  filterMonth: MonthKey | '';
  filterCategory: string;
  filteredTotal: number;
  onOpenMonthPicker: () => void;
  onOpenCategoryPicker: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterMonth,
  filterCategory,
  filteredTotal,
  onOpenMonthPicker,
  onOpenCategoryPicker,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.row}>
      {/* Month picker trigger */}
      <TouchableOpacity style={styles.picker} onPress={onOpenMonthPicker} activeOpacity={0.7}>
        <Text style={filterMonth ? styles.pickerText : styles.pickerPlaceholder}>
          {filterMonth ? `\u{1F4C5} ${monthShortNames[filterMonth]}` : '\u{1F4C5} All Months'}
        </Text>
        <Text style={styles.arrow}>{'\u25BC'}</Text>
      </TouchableOpacity>

      {/* Category picker trigger */}
      <TouchableOpacity style={styles.picker} onPress={onOpenCategoryPicker} activeOpacity={0.7}>
        <Text style={filterCategory ? styles.pickerText : styles.pickerPlaceholder}>
          {filterCategory || '\u{1F3F7}\uFE0F All Categories'}
        </Text>
        <Text style={styles.arrow}>{'\u25BC'}</Text>
      </TouchableOpacity>

      {/* Filtered total */}
      <View style={styles.totalPill}>
        <Text style={styles.totalLabel}>FILTERED</Text>
        <Text style={styles.totalValue}>{formatEuro(filteredTotal)}</Text>
      </View>
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    gap: t.spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    paddingVertical: t.spacing.sm + 2,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.full,
  },
  pickerText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.sm,
    color: t.colors.textPrimary,
  },
  pickerPlaceholder: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
  },
  arrow: {
    fontSize: 8,
    color: t.colors.accent,
  },
  totalPill: {
    marginLeft: 'auto',
    alignItems: 'center',
    paddingVertical: t.spacing.xs + 2,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.accentMuted,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.full,
  },
  totalLabel: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xs - 1,
    color: t.colors.textMuted,
    letterSpacing: 1,
  },
  totalValue: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.md,
    color: t.colors.accent,
  },
}));
