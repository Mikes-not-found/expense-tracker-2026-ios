/**
 * DashboardScreen — annual overview with stats, charts, import/export.
 * Mirrors the PWA's renderDashboard() function.
 */
import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatCard } from '../components/StatCard';
import { SpendingRow } from '../components/SpendingRow';
import { FilterBar } from '../components/FilterBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ToastContainer } from '../components/Toast';

import { useDashboard, useDataActions } from '../store/hooks';
import { useToast } from '../hooks/useToast';
import { useHaptics } from '../hooks/useHaptics';

import { months, monthShortNames, type MonthKey } from '../constants/categories';
import {
  formatEuro,
  sortByAmountDesc,
  calculateFilteredTotal,
} from '../utils/calculations';
import { importExcel, downloadExcel } from '../utils/excel';
import { createStyles } from '../utils/styles';
import { theme } from '../constants/theme';

export const DashboardScreen: React.FC = () => {
  const dashboard = useDashboard();
  const { expenses, summaries, workbook, importData } = useDataActions();
  const { toasts, showToast } = useToast();
  const haptics = useHaptics();

  const [filterMonth, setFilterMonth] = useState<MonthKey | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showMonthOptions, setShowMonthOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);

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

  const handleMonthChange = (m: MonthKey | '') => {
    setFilterMonth(m);
    setShowMonthOptions(false);
    haptics.selection();
  };

  const handleCategoryChange = (c: string) => {
    setFilterCategory(c);
    setShowCategoryOptions(false);
    haptics.selection();
  };

  const sortedCategories = sortByAmountDesc(dashboard.categoryTotals);
  const sortedSubcategories = sortByAmountDesc(dashboard.subcategoryTotals);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Toolbar */}
        <View style={styles.toolbar}>
          <Button variant="success" onPress={handleImport} small>
            Import Excel
          </Button>
          <Button variant="primary" onPress={handleExport} small>
            Download Excel
          </Button>
        </View>

        {/* Filters */}
        <FilterBar
          filterMonth={filterMonth}
          filterCategory={filterCategory}
          filteredTotal={filteredTotal}
          onMonthChange={handleMonthChange}
          onCategoryChange={handleCategoryChange}
          showMonthOptions={showMonthOptions}
          showCategoryOptions={showCategoryOptions}
          onToggleMonthOptions={() => {
            setShowMonthOptions((v) => !v);
            setShowCategoryOptions(false);
          }}
          onToggleCategoryOptions={() => {
            setShowCategoryOptions((v) => !v);
            setShowMonthOptions(false);
          }}
        />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Total Year 2026" value={formatEuro(dashboard.yearTotal)} />
          <StatCard
            label="Monthly Average"
            value={formatEuro(dashboard.monthlyAverage)}
            valueColor={theme.colors.amber}
          />
          <StatCard
            label="Top Month"
            value={dashboard.topMonth}
            valueColor={theme.colors.green}
          />
          <StatCard
            label="Total Entries"
            value={String(dashboard.totalEntries)}
          />
        </View>

        {/* Monthly Breakdown */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
          </View>
          <View style={styles.sectionBody}>
            {months.map((m) => (
              <SpendingRow
                key={m}
                name={monthShortNames[m]}
                amount={dashboard.monthlyTotals[m]}
                total={dashboard.yearTotal}
              />
            ))}
          </View>
        </Card>

        {/* By Category */}
        {sortedCategories.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>By Category</Text>
            </View>
            <View style={styles.sectionBody}>
              {sortedCategories.map(([cat, amount]) => (
                <SpendingRow
                  key={cat}
                  name={cat}
                  amount={amount}
                  total={dashboard.yearTotal}
                />
              ))}
            </View>
          </Card>
        )}

        {/* Subcategories */}
        {sortedSubcategories.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Subcategories</Text>
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

      <ToastContainer toasts={toasts} />
    </SafeAreaView>
  );
};

const styles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bgBase,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: t.spacing.md,
    gap: t.spacing.lg,
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
  },
  sectionTitle: {
    fontFamily: t.fonts.monoSemiBold,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
  },
  sectionBody: {
    paddingVertical: t.spacing.sm,
  },
}));
