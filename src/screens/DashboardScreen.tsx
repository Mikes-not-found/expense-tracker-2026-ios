/**
 * DashboardScreen — kawaii annual overview with pink/green pastels.
 * Floating emojis, pastel stat cards, emoji categories.
 */
import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatCard } from '../components/StatCard';
import { SpendingRow } from '../components/SpendingRow';
import { FilterBar } from '../components/FilterBar';
import { PickerSheet } from '../components/PickerSheet';
import { FloatingEmojis } from '../components/FloatingEmojis';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ToastContainer } from '../components/Toast';

import { useDashboard, useDataActions } from '../store/hooks';
import { useToast } from '../hooks/useToast';
import { useHaptics } from '../hooks/useHaptics';
import { useTheme } from '../store/ThemeContext';

import {
  months,
  monthShortNames,
  monthEmojis,
  categoryNames,
  categoryEmojis,
  type MonthKey,
} from '../constants/categories';
import {
  formatEuro,
  sortByAmountDesc,
  calculateFilteredTotal,
} from '../utils/calculations';
import { importExcel, downloadExcel } from '../utils/excel';
import { makeStyles } from '../utils/styles';

export const DashboardScreen: React.FC = () => {
  const dashboard = useDashboard();
  const { expenses, summaries, workbook, importData } = useDataActions();
  const { toasts, showToast } = useToast();
  const haptics = useHaptics();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useStyles();

  const [filterMonth, setFilterMonth] = useState<MonthKey | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);

  const filteredTotal = calculateFilteredTotal(expenses, filterMonth, filterCategory);

  const handleImport = useCallback(async () => {
    try {
      const result = await importExcel();
      if (result) {
        importData({
          expenses: result.expenses,
          summaries: result.summaries,
          workbook: result.workbookBase64,
        });
        haptics.success();
        showToast('Excel imported successfully', 'success');
      }
    } catch (err) {
      haptics.error();
      showToast('Error importing Excel', 'error');
    }
  }, [importData, haptics, showToast]);

  const handleExport = useCallback(async () => {
    try {
      await downloadExcel(expenses, summaries, workbook);
      haptics.success();
      showToast('Excel exported', 'success');
    } catch (err) {
      haptics.error();
      showToast('Error exporting Excel', 'error');
    }
  }, [expenses, summaries, workbook, haptics, showToast]);

  const handleMonthSelect = useCallback(
    (displayName: string) => {
      if (!displayName) {
        setFilterMonth('');
      } else {
        const key = months.find((m) => monthShortNames[m] === displayName);
        setFilterMonth(key ?? '');
      }
      setMonthPickerVisible(false);
      haptics.selection();
    },
    [haptics]
  );

  const handleCategorySelect = useCallback(
    (cat: string) => {
      setFilterCategory(cat);
      setCategoryPickerVisible(false);
      haptics.selection();
    },
    [haptics]
  );

  const sortedCategories = sortByAmountDesc(dashboard.categoryTotals);
  const sortedSubcategories = sortByAmountDesc(dashboard.subcategoryTotals);

  const monthDisplayNames = months.map((m) => monthShortNames[m]);
  const selectedMonthDisplay = filterMonth ? monthShortNames[filterMonth] : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FloatingEmojis />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.appTitle}>{'\u{1F338}'} Celi Expenses</Text>
            <Text style={styles.appSubtitle}>Kakeibo 2026 {'\u{1F33F}'}</Text>
          </View>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme} activeOpacity={0.7}>
            <Text style={styles.themeToggleIcon}>{isDark ? '\u2600\uFE0F' : '\u{1F319}'}</Text>
          </TouchableOpacity>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <Button variant="success" onPress={handleImport} small>
            {'\u{1F4E5}'} Import Excel
          </Button>
          <Button variant="primary" onPress={handleExport} small>
            {'\u{1F4E4}'} Export Excel
          </Button>
        </View>

        {/* Filters */}
        <FilterBar
          filterMonth={filterMonth}
          filterCategory={filterCategory}
          filteredTotal={filteredTotal}
          onOpenMonthPicker={() => setMonthPickerVisible(true)}
          onOpenCategoryPicker={() => setCategoryPickerVisible(true)}
        />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Year 2026"
            value={formatEuro(dashboard.yearTotal)}
            emoji={'\u{1F4B0}'}
          />
          <StatCard
            label="Monthly Average"
            value={formatEuro(dashboard.monthlyAverage)}
            emoji={'\u{1F4CA}'}
            valueColor={theme.colors.amber}
          />
          <StatCard
            label="Top Month"
            value={dashboard.topMonth}
            emoji={'\u{1F3C6}'}
            valueColor={theme.colors.green}
          />
          <StatCard
            label="Total Entries"
            value={String(dashboard.totalEntries)}
            emoji={'\u{1F4DD}'}
          />
        </View>

        {/* Monthly Breakdown */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'\u{1F4C5}'} Monthly Breakdown</Text>
          </View>
          <View style={styles.sectionBody}>
            {months.map((m) => (
              <SpendingRow
                key={m}
                name={monthShortNames[m]}
                amount={dashboard.monthlyTotals[m]}
                total={dashboard.yearTotal}
                emoji={monthEmojis[m]}
              />
            ))}
          </View>
        </Card>

        {/* By Category */}
        {sortedCategories.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{'\u{1F3F7}\uFE0F'} By Category</Text>
            </View>
            <View style={styles.sectionBody}>
              {sortedCategories.map(([cat, amount]) => (
                <SpendingRow
                  key={cat}
                  name={cat}
                  amount={amount}
                  total={dashboard.yearTotal}
                  emoji={categoryEmojis[cat]}
                />
              ))}
            </View>
          </Card>
        )}

        {/* Subcategories */}
        {sortedSubcategories.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{'\u{1F4CB}'} Subcategories</Text>
            </View>
            <View style={styles.sectionBody}>
              {sortedSubcategories.map(([sub, amount]) => (
                <SpendingRow
                  key={sub}
                  name={sub}
                  amount={amount}
                  total={dashboard.yearTotal}
                />
              ))}
            </View>
          </Card>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Sheet Pickers */}
      <PickerSheet
        title="Select Month"
        options={monthDisplayNames}
        selected={selectedMonthDisplay}
        onSelect={handleMonthSelect}
        onDismiss={() => setMonthPickerVisible(false)}
        visible={monthPickerVisible}
        allowClear
        clearLabel="All Months"
      />

      <PickerSheet
        title="Select Category"
        options={categoryNames}
        selected={filterCategory}
        onSelect={handleCategorySelect}
        onDismiss={() => setCategoryPickerVisible(false)}
        visible={categoryPickerVisible}
        allowClear
        clearLabel="All Categories"
      />

      <ToastContainer toasts={toasts} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bgBase,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    padding: t.spacing.md,
    gap: t.spacing.lg,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: t.spacing.sm,
  },
  appTitle: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize['2xl'] + 2,
    color: t.colors.textPrimary,
  },
  appSubtitle: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.sm + 1,
    color: t.colors.textMuted,
    marginTop: 2,
  },
  themeToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: t.colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: t.colors.border,
  },
  themeToggleIcon: {
    fontSize: 22,
  },
  toolbar: {
    flexDirection: 'row',
    gap: t.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.spacing.md,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
    backgroundColor: t.colors.bgElevated,
  },
  sectionTitle: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  sectionBody: {
    paddingVertical: t.spacing.sm,
  },
}));
