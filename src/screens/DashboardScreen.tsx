/**
 * DashboardScreen — kawaii annual overview with pink/green pastels.
 * Floating emojis, pastel stat cards, tabbed breakdown.
 */
import React, { useState, useCallback } from 'react';

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
    } catch (err: unknown) {
      console.error('Excel import error:', err);
      haptics.error();
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Import failed: ${msg}`, 'error');
    }
  }, [importData, haptics, showToast]);

  const handleExport = useCallback(async () => {
    try {
      await downloadExcel(expenses, summaries, workbook);
      haptics.success();
      showToast('Excel exported', 'success');
    } catch (err: unknown) {
      console.error('Excel export error:', err);
      haptics.error();
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Export failed: ${msg}`, 'error');
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

  const tabs: { key: BreakdownTab; label: string; emoji: string }[] = [
    { key: 'monthly', label: 'Monthly', emoji: '\u{1F4C5}' },
    { key: 'category', label: 'Category', emoji: '\u{1F3F7}\uFE0F' },
    { key: 'subcategory', label: 'Sub', emoji: '\u{1F4CB}' },
  ];

  return (
    <div style={styles.safe}>
      <FloatingEmojis />
      <div style={styles.scroll}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.headerSection}>
            <div>
              <div style={styles.appTitle}>{'\u{1F338}'} Celi Expenses</div>
              <div style={styles.appSubtitle}>Kakeibo 2026 {'\u{1F33F}'}</div>
            </div>
            <div style={styles.themeToggle} onClick={toggleTheme}>
              <span style={styles.themeToggleIcon}>{isDark ? '\u2600\uFE0F' : '\u{1F319}'}</span>
            </div>
          </div>

          {/* Toolbar — Import/Export + Filters */}
          <div style={styles.toolbar}>
            <Button variant="success" onClick={handleImport} small>
              {'\u{1F4E5}'} Import
            </Button>
            <Button variant="primary" onClick={handleExport} small>
              {'\u{1F4E4}'} Export
            </Button>
            <div
              style={styles.filterChip}
              onClick={() => setMonthPickerVisible(true)}
            >
              <span style={filterMonth ? styles.filterChipTextActive : styles.filterChipText}>
                {filterMonth ? monthShortNames[filterMonth] : '\u{1F4C5} All'}
              </span>
            </div>
            <div
              style={styles.filterChip}
              onClick={() => setCategoryPickerVisible(true)}
            >
              <span style={filterCategory ? styles.filterChipTextActive : styles.filterChipText}>
                {filterCategory || '\u{1F3F7}\uFE0F All'}
              </span>
            </div>
          </div>

          {/* Filtered total */}
          {(filterMonth || filterCategory) ? (
            <div style={styles.filteredBanner}>
              <span style={styles.filteredLabel}>Filtered Total</span>
              <span style={styles.filteredValue}>{formatEuro(filteredTotal)}</span>
            </div>
          ) : null}

          {/* Stats Grid — 2x2 equal cards */}
          <div style={styles.statsGrid}>
            <StatCard
              label="Total Year 2026"
              value={formatEuro(dashboard.yearTotal)}
              emoji={'\u{1F4B0}'}
              style={{ flex: '1 1 calc(50% - 8px)' }}
            />
            <StatCard
              label="Monthly Avg"
              value={formatEuro(dashboard.monthlyAverage)}
              emoji={'\u{1F4CA}'}
              valueColor={theme.colors.amber}
              style={{ flex: '1 1 calc(50% - 8px)' }}
            />
            <StatCard
              label="Top Month"
              value={dashboard.topMonth}
              emoji={'\u{1F3C6}'}
              valueColor={theme.colors.green}
              style={{ flex: '1 1 calc(50% - 8px)' }}
            />
            <StatCard
              label="Total Entries"
              value={String(dashboard.totalEntries)}
              emoji={'\u{1F4DD}'}
              style={{ flex: '1 1 calc(50% - 8px)' }}
            />
          </div>

          {/* Breakdown Tabs */}
          <div style={styles.tabBar}>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
                onClick={() => setActiveTab(tab.key)}
              >
                <span style={{
                  ...styles.tabText,
                  ...(activeTab === tab.key ? styles.tabTextActive : {}),
                }}>
                  {tab.emoji} {tab.label}
                </span>
              </div>
            ))}
          </div>

          {/* Active breakdown content */}
          <Card style={styles.sectionCard}>
            <div style={styles.sectionBody}>
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
                  <div style={styles.emptyText}>No category data yet</div>
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
                  <div style={styles.emptyText}>No subcategory data yet</div>
                ))}
            </div>
          </Card>

          <div style={{ height: 40 }} />
        </div>
      </div>

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
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  safe: {
    position: 'relative',
    height: '100%',
    backgroundColor: t.colors.bgBase,
    display: 'flex',
    flexDirection: 'column',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto' as const,
  },
  content: {
    padding: t.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing.md,
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: t.spacing.xs,
  },
  appTitle: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize['2xl'] + 2,
    color: t.colors.textPrimary,
  },
  appSubtitle: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.sm + 1,
    color: t.colors.textMuted,
    marginTop: 2,
  },
  themeToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: t.colors.bgElevated,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    cursor: 'pointer',
  },
  themeToggleIcon: {
    fontSize: 22,
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    gap: t.spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  filterChip: {
    paddingTop: t.spacing.xs + 3,
    paddingBottom: t.spacing.xs + 3,
    paddingLeft: t.spacing.md,
    paddingRight: t.spacing.md,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    borderRadius: t.radius.full,
    cursor: 'pointer',
  },
  filterChipText: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
  },
  filterChipTextActive: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.sm,
    color: t.colors.accent,
  },
  filteredBanner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: t.spacing.sm + 2,
    paddingBottom: t.spacing.sm + 2,
    paddingLeft: t.spacing.md,
    paddingRight: t.spacing.md,
    backgroundColor: t.colors.accentMuted,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
  },
  filteredLabel: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  filteredValue: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.accent,
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: t.spacing.md,
    justifyContent: 'space-between',
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: t.colors.bgSurface,
    borderRadius: t.radius.full,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingTop: t.spacing.sm + 2,
    paddingBottom: t.spacing.sm + 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: t.radius.full,
    cursor: 'pointer',
  },
  tabActive: {
    backgroundColor: t.colors.accent,
  },
  tabText: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
  },
  tabTextActive: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    color: '#ffffff',
  },
  sectionCard: {
    overflow: 'hidden',
  },
  sectionBody: {
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.sm,
  },
  emptyText: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textMuted,
    textAlign: 'center' as const,
    paddingTop: t.spacing.xl,
    paddingBottom: t.spacing.xl,
  },
}));
