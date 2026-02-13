/**
 * FilterBar — dashboard filter controls (month + category).
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { months, monthShortNames, categoryNames, type MonthKey } from '../constants/categories';
import { makeStyles } from '../utils/styles';
import { formatEuro } from '../utils/calculations';

interface FilterBarProps {
  filterMonth: MonthKey | '';
  filterCategory: string;
  filteredTotal: number;
  onMonthChange: (month: MonthKey | '') => void;
  onCategoryChange: (category: string) => void;
  showMonthOptions: boolean;
  showCategoryOptions: boolean;
  onToggleMonthOptions: () => void;
  onToggleCategoryOptions: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterMonth,
  filterCategory,
  filteredTotal,
  onMonthChange,
  onCategoryChange,
  showMonthOptions,
  showCategoryOptions,
  onToggleMonthOptions,
  onToggleCategoryOptions,
}) => {
  const styles = useStyles();

  return (
  <View>
    <View style={styles.row}>
      {/* Month picker */}
      <TouchableOpacity style={styles.picker} onPress={onToggleMonthOptions}>
        <Text style={filterMonth ? styles.pickerText : styles.pickerPlaceholder}>
          {filterMonth ? monthShortNames[filterMonth] : 'All Months'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {/* Category picker */}
      <TouchableOpacity style={styles.picker} onPress={onToggleCategoryOptions}>
        <Text style={filterCategory ? styles.pickerText : styles.pickerPlaceholder}>
          {filterCategory || 'All Categories'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {/* Filtered total */}
      <View style={styles.totalPill}>
        <Text style={styles.totalLabel}>Filtered</Text>
        <Text style={styles.totalValue}>{formatEuro(filteredTotal)}</Text>
      </View>
    </View>

    {/* Month options dropdown */}
    {showMonthOptions && (
      <View style={styles.dropdown}>
        <TouchableOpacity
          style={[styles.option, !filterMonth && styles.optionActive]}
          onPress={() => onMonthChange('')}
        >
          <Text style={[styles.optionText, !filterMonth && styles.optionTextActive]}>
            All Months
          </Text>
        </TouchableOpacity>
        {months.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.option, filterMonth === m && styles.optionActive]}
            onPress={() => onMonthChange(m)}
          >
            <Text style={[styles.optionText, filterMonth === m && styles.optionTextActive]}>
              {monthShortNames[m]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}

    {/* Category options dropdown */}
    {showCategoryOptions && (
      <View style={styles.dropdown}>
        <TouchableOpacity
          style={[styles.option, !filterCategory && styles.optionActive]}
          onPress={() => onCategoryChange('')}
        >
          <Text style={[styles.optionText, !filterCategory && styles.optionTextActive]}>
            All Categories
          </Text>
        </TouchableOpacity>
        {categoryNames.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.option, filterCategory === cat && styles.optionActive]}
            onPress={() => onCategoryChange(cat)}
          >
            <Text style={[styles.optionText, filterCategory === cat && styles.optionTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
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
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.sm,
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
    paddingVertical: t.spacing.xs,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.full,
  },
  totalLabel: {
    fontFamily: t.fonts.mono,
    fontSize: t.fontSize.xs - 1,
    color: t.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.md,
    color: t.colors.accent,
  },
  dropdown: {
    marginTop: t.spacing.xs,
    backgroundColor: t.colors.bgElevated,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.sm,
    maxHeight: 250,
  },
  option: {
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  optionActive: {
    backgroundColor: t.colors.accentMuted,
  },
  optionText: {
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
  },
  optionTextActive: {
    color: t.colors.accent,
    fontFamily: t.fonts.sansSemiBold,
  },
}));
