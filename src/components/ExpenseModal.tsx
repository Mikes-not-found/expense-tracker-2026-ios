/**
 * ExpenseModal — kawaii expense form with pastel pink styling.
 * Web version using div overlay instead of RN Modal.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { PickerSheet } from './PickerSheet';
import { makeStyles } from '../utils/styles';
import { categorySubcategories, categoryNames } from '../constants/categories';
import type { Expense } from '../types';

interface ExpenseModalProps {
  visible: boolean;
  expense: Expense | null;
  onSave: (expense: Expense) => void;
  onClose: () => void;
}

const emptyForm = { name: '', date: '', amount: '', primary: '', secondary: '' };

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  expense,
  onSave,
  onClose,
}) => {
  const styles = useStyles();
  const [form, setForm] = useState(emptyForm);
  const [primarySheetVisible, setPrimarySheetVisible] = useState(false);
  const [secondarySheetVisible, setSecondarySheetVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      if (expense) {
        setForm({
          name: expense.name,
          date: String(expense.date),
          amount: String(expense.amount),
          primary: expense.primary,
          secondary: expense.secondary,
        });
      } else {
        setForm(emptyForm);
      }
      setPrimarySheetVisible(false);
      setSecondarySheetVisible(false);
    }
  }, [visible, expense]);

  const subcategories = form.primary
    ? categorySubcategories[form.primary] ?? []
    : [];

  const isValid =
    form.name.trim() !== '' &&
    form.date !== '' &&
    !isNaN(parseInt(form.date, 10)) &&
    form.amount !== '' &&
    !isNaN(parseFloat(form.amount)) &&
    form.primary !== '';

  const handleSave = useCallback(() => {
    if (!isValid) return;
    onSave({
      name: form.name.trim(),
      date: parseInt(form.date, 10),
      amount: parseFloat(form.amount),
      primary: form.primary,
      secondary: form.secondary,
    });
  }, [form, isValid, onSave]);

  const selectPrimary = useCallback((cat: string) => {
    setForm((f) => ({ ...f, primary: cat, secondary: '' }));
    setPrimarySheetVisible(false);
  }, []);

  const selectSecondary = useCallback((sub: string) => {
    setForm((f) => ({ ...f, secondary: sub }));
    setSecondarySheetVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.root}>
        <div style={styles.header}>
          <span style={styles.title}>
            {expense ? '\u{270E}\uFE0F Edit Expense' : '\u{2795} New Expense'}
          </span>
          <button onClick={onClose} style={styles.closeBtn}>
            <span style={styles.closeText}>{'\u2715'}</span>
          </button>
        </div>

        <div style={styles.body}>
          <label style={styles.label}>{'\u{1F4DD}'} EXPENSE NAME</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Grocery shopping"
          />

          <div style={styles.row}>
            <div style={styles.halfField}>
              <label style={styles.label}>{'\u{1F4C5}'} DAY</label>
              <input
                style={styles.input}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                placeholder="1-31"
                type="text"
                inputMode="numeric"
                maxLength={2}
              />
            </div>
            <div style={styles.halfField}>
              <label style={styles.label}>{'\u{1F4B0}'} AMOUNT ({'\u20AC'})</label>
              <input
                style={styles.input}
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value.replace(',', '.') }))}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
              />
            </div>
          </div>

          <label style={styles.label}>{'\u{1F3F7}\uFE0F'} CATEGORY</label>
          <div
            style={styles.picker}
            onClick={() => setPrimarySheetVisible(true)}
          >
            <span style={form.primary ? styles.pickerText : styles.pickerPlaceholder}>
              {form.primary || 'Select...'}
            </span>
            <span style={styles.pickerArrow}>{'\u25BC'}</span>
          </div>

          <label style={styles.label}>{'\u{1F4CC}'} SUBCATEGORY</label>
          <div
            style={{
              ...styles.picker,
              ...(!form.primary ? styles.pickerDisabled : {}),
            }}
            onClick={() => form.primary && setSecondarySheetVisible(true)}
          >
            <span style={form.secondary ? styles.pickerText : styles.pickerPlaceholder}>
              {form.secondary || (form.primary ? 'Select...' : 'Select category first...')}
            </span>
            <span style={styles.pickerArrow}>{'\u25BC'}</span>
          </div>

          <div style={{ height: 40 }} />
        </div>

        <div style={styles.actions}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid}
          >
            {'\u{1F4BE}'} Save Expense
          </Button>
        </div>
      </div>

      <PickerSheet
        title="Select Category"
        options={categoryNames}
        selected={form.primary}
        onSelect={selectPrimary}
        onDismiss={() => setPrimarySheetVisible(false)}
        visible={primarySheetVisible}
      />
      <PickerSheet
        title="Select Subcategory"
        options={subcategories}
        selected={form.secondary}
        onSelect={selectSecondary}
        onDismiss={() => setSecondarySheetVisible(false)}
        visible={secondarySheetVisible}
      />
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 800,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  root: {
    width: '100%',
    maxWidth: 500,
    height: '95%',
    backgroundColor: t.colors.bgBase,
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    paddingTop: t.spacing.lg,
    paddingBottom: t.spacing.md,
    borderBottomWidth: 1.5,
    borderBottomStyle: 'solid',
    borderBottomColor: t.colors.border,
    backgroundColor: t.colors.bgSurface,
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
  },
  title: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.xl + 2,
    color: t.colors.textPrimary,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.colors.bgInteractive,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    cursor: 'pointer',
    outline: 'none',
    padding: 0,
  },
  closeText: {
    fontSize: 18,
    color: t.colors.textSecondary,
  },
  body: {
    flex: 1,
    overflowY: 'auto' as const,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    paddingTop: t.spacing.lg,
  },
  label: {
    display: 'block',
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: t.spacing.sm,
    marginTop: t.spacing.md,
  },
  input: {
    width: '100%',
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: t.spacing.md,
  },
  halfField: {
    flex: 1,
  },
  picker: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    cursor: 'pointer',
  },
  pickerDisabled: {
    opacity: 0.5,
    cursor: 'default' as const,
  },
  pickerText: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  pickerPlaceholder: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textMuted,
  },
  pickerArrow: {
    fontSize: 10,
    color: t.colors.accent,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: t.spacing.sm,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.xl,
    borderTopWidth: 1.5,
    borderTopStyle: 'solid',
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.bgSurface,
  },
}));
