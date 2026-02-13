/**
 * DashboardScreen — kawaii annual overview with pink/green pastels.
 * Floating emojis, pastel stat cards, tabbed breakdown.
 */
import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatCard } from '../components/StatCard';
import { SpendingRow } from '../components/SpendingRow';
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

type BreakdownTab = 'monthly' | 'category' | 'subcategory';

export const DashboardScreen: React.FC = () => {
  const dashboard = useDashboard();
  const { expenses, summaries, workbook, importData } = useDataActions();
  const { toasts, showToast } = useToast();
  const haptics = useHaptics();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useStyles();
  const { width: screenWidth } = useWindowDimensions();

  const [filterMonth, setFilterMonth] = useState<MonthKey | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<BreakdownTab>('monthly');

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

  // Card width: 2 per row, accounting for padding and gap
  const cardWidth = (screenWidth - 16 * 2 - 16) / 2;

  const tabs: { key: BreakdownTab; label: string; emoji: string }[] = [
    { key: 'monthly', label: 'Monthly', emoji: '\u{1F4C5}' },
    { key: 'category', label: 'Category', emoji: '\u{1F3F7}\uFE0F' },
    { key: 'subcategory', label: 'Sub', emoji: '\u{1F4CB}' },
  ];

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

        {/* Toolbar — Import/Export + Filters */}
        <View style={styles.toolbar}>
          <Button variant="success" onPress={handleImport} small>
            {'\u{1F4E5}'} Import
          </Button>
          <Button variant="primary" onPress={handleExport} small>
            {'\u{1F4E4}'} Export
          </Button>
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setMonthPickerVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={filterMonth ? styles.filterChipTextActive : styles.filterChipText}>
              {filterMonth ? monthShortNames[filterMonth] : '\u{1F4C5} All'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setCategoryPickerVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={filterCategory ? styles.filterChipTextActive : styles.filterChipText} numberOfLines={1}>
              {filterCategory || '\u{1F3F7}\uFE0F All'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtered total */}
        {(filterMonth || filterCategory) ? (
          <View style={styles.filteredBanner}>
            <Text style={styles.filteredLabel}>Filtered Total</Text>
            <Text style={styles.filteredValue}>{formatEuro(filteredTotal)}</Text>
          </View>
        ) : null}

        {/* Stats Grid — 2x2 equal cards */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Year 2026"
            value={formatEuro(dashboard.yearTotal)}
            emoji={'\u{1F4B0}'}
            style={{ width: cardWidth }}
          />
          <StatCard
            label="Monthly Avg"
            value={formatEuro(dashboard.monthlyAverage)}
            emoji={'\u{1F4CA}'}
            valueColor={theme.colors.amber}
            style={{ width: cardWidth }}
          />
          <StatCard
            label="Top Month"
            value={dashboard.topMonth}
            emoji={'\u{1F3C6}'}
            valueColor={theme.colors.green}
            style={{ width: cardWidth }}
          />
          <StatCard
            label="Total Entries"
            value={String(dashboard.totalEntries)}
            emoji={'\u{1F4DD}'}
            style={{ width: cardWidth }}
          />
        </View>

        {/* Breakdown Tabs */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.emoji} {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active breakdown content */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionBody}>
            {activeTab === 'monthly' &&
              months.map((m) => (
                <SpendingRow
                  key={m}
                  name={monthShortNames[m]}
                  amount={dashboard.monthlyTotals[m]}
                  total={dashboard.yearTotal}
                  emoji={monthEmojis[m]}
                />
              ))}

            {activeTab === 'category' &&
              (sortedCategories.length > 0 ? (
                sortedCategories.map(([cat, amount]) => (
                  <SpendingRow
                    key={cat}
                    name={cat}
                    amount={amount}
                    total={dashboard.yearTotal}
                    emoji={categoryEmojis[cat]}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No category data yet</Text>
              ))}

            {activeTab === 'subcategory' &&
              (sortedSubcategories.length > 0 ? (
                sortedSubcategories.map(([sub, amount]) => (
                  <SpendingRow
                    key={sub}
                    name={sub}
                    amount={amount}
                    total={dashboard.yearTotal}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No subcategory data yet</Text>
              ))}
          </View>
        </Card>

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
    gap: t.spacing.md,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: t.spacing.xs,
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
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingVertical: t.spacing.xs + 3,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.full,
  },
  filterChipText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
  },
  filterChipTextActive: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.sm,
    color: t.colors.accent,
  },
  filteredBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: t.spacing.sm + 2,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.accentMuted,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
  },
  filteredLabel: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filteredValue: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.spacing.md,
    justifyContent: 'space-between',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: t.colors.bgSurface,
    borderRadius: t.radius.full,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: t.spacing.sm + 2,
    alignItems: 'center',
    borderRadius: t.radius.full,
  },
  tabActive: {
    backgroundColor: t.colors.accent,
  },
  tabText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
  },
  tabTextActive: {
    fontFamily: t.fonts.monoBold,
    color: '#ffffff',
  },
  sectionCard: {
    overflow: 'hidden',
  },
  sectionBody: {
    paddingVertical: t.spacing.sm,
  },
  emptyText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textMuted,
    textAlign: 'center',
    paddingVertical: t.spacing.xl,
  },
}));
