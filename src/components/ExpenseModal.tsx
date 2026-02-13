/**
 * ExpenseModal — kawaii expense form with pastel pink styling.
 * Keyboard dismiss: tapping outside inputs closes keyboard.
 * iOS number-pad gets a Done button via InputAccessoryView.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  InputAccessoryView,
} from 'react-native';
import { Button } from './ui/Button';
import { PickerSheet } from './PickerSheet';
import { makeStyles } from '../utils/styles';
import { useTheme } from '../store/ThemeContext';
import { categorySubcategories, categoryNames } from '../constants/categories';
import type { Expense } from '../types';

interface ExpenseModalProps {
  visible: boolean;
  expense: Expense | null;
  onSave: (expense: Expense) => void;
  onClose: () => void;
}

const emptyForm = { name: '', date: '', amount: '', primary: '', secondary: '' };
const DAY_ACCESSORY_ID = 'expense-day-done';
const AMOUNT_ACCESSORY_ID = 'expense-amount-done';

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  expense,
  onSave,
  onClose,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
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
    Keyboard.dismiss();
    onSave({
      name: form.name.trim(),
      date: parseInt(form.date, 10),
      amount: parseFloat(form.amount),
      primary: form.primary,
      secondary: form.secondary,
    });
  }, [form, isValid, onSave]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const selectPrimary = useCallback((cat: string) => {
    setForm((f) => ({ ...f, primary: cat, secondary: '' }));
    setPrimarySheetVisible(false);
  }, []);

  const selectSecondary = useCallback((sub: string) => {
    setForm((f) => ({ ...f, secondary: sub }));
    setSecondarySheetVisible(false);
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.root}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {expense ? '\u{270E}\uFE0F Edit Expense' : '\u{2795} New Expense'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>{'\u2715'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>{'\u{1F4DD}'} EXPENSE NAME</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="e.g. Grocery shopping"
              placeholderTextColor="#a8bfa0"
              autoFocus={false}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>{'\u{1F4C5}'} DAY</Text>
                <TextInput
                  style={styles.input}
                  value={form.date}
                  onChangeText={(v) => setForm((f) => ({ ...f, date: v }))}
                  placeholder="1-31"
                  placeholderTextColor="#a8bfa0"
                  keyboardType="number-pad"
                  maxLength={2}
                  inputAccessoryViewID={Platform.OS === 'ios' ? DAY_ACCESSORY_ID : undefined}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>{'\u{1F4B0}'} AMOUNT ({'\u20AC'})</Text>
                <TextInput
                  style={styles.input}
                  value={form.amount}
                  onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))}
                  placeholder="0.00"
                  placeholderTextColor="#a8bfa0"
                  keyboardType="decimal-pad"
                  inputAccessoryViewID={Platform.OS === 'ios' ? AMOUNT_ACCESSORY_ID : undefined}
                />
              </View>
            </View>

            <Text style={styles.label}>{'\u{1F3F7}\uFE0F'} CATEGORY</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => {
                Keyboard.dismiss();
                setPrimarySheetVisible(true);
              }}
            >
              <Text style={form.primary ? styles.pickerText : styles.pickerPlaceholder}>
                {form.primary || 'Select...'}
              </Text>
              <Text style={styles.pickerArrow}>{'\u25BC'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>{'\u{1F4CC}'} SUBCATEGORY</Text>
            <TouchableOpacity
              style={[styles.picker, !form.primary && styles.pickerDisabled]}
              onPress={() => {
                if (form.primary) {
                  Keyboard.dismiss();
                  setSecondarySheetVisible(true);
                }
              }}
              disabled={!form.primary}
            >
              <Text style={form.secondary ? styles.pickerText : styles.pickerPlaceholder}>
                {form.secondary || (form.primary ? 'Select...' : 'Select category first...')}
              </Text>
              <Text style={styles.pickerArrow}>{'\u25BC'}</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.actions}>
            <Button variant="ghost" onPress={handleClose}>Cancel</Button>
            <Button
              variant="primary"
              onPress={handleSave}
              disabled={!isValid}
            >
              {'\u{1F4BE}'} Save Expense
            </Button>
          </View>

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
        </View>
      </TouchableWithoutFeedback>

      {/* iOS Done buttons — separate nativeID per keyboard type to avoid iOS conflicts */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={DAY_ACCESSORY_ID}>
          <View style={[styles.accessoryBar, { backgroundColor: theme.colors.bgSurface, borderTopColor: theme.colors.border }]}>
            <TouchableOpacity onPress={Keyboard.dismiss} style={styles.doneButton}>
              <Text style={[styles.doneText, { color: theme.colors.accent }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={AMOUNT_ACCESSORY_ID}>
          <View style={[styles.accessoryBar, { backgroundColor: theme.colors.bgSurface, borderTopColor: theme.colors.border }]}>
            <TouchableOpacity onPress={Keyboard.dismiss} style={styles.doneButton}>
              <Text style={[styles.doneText, { color: theme.colors.accent }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </Modal>
  );
};

const useStyles = makeStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.xl + 20,
    paddingBottom: t.spacing.md,
    borderBottomWidth: 1.5,
    borderBottomColor: t.colors.border,
    backgroundColor: t.colors.bgSurface,
  },
  title: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xl + 2,
    color: t.colors.textPrimary,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.colors.bgInteractive,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  closeText: {
    fontSize: 18,
    color: t.colors.textSecondary,
  },
  body: {
    flex: 1,
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.lg,
  },
  label: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: t.spacing.sm,
    marginTop: t.spacing.md,
  },
  input: {
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: t.spacing.md,
  },
  halfField: {
    flex: 1,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pickerDisabled: {
    opacity: 0.5,
  },
  pickerText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  pickerPlaceholder: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textMuted,
  },
  pickerArrow: {
    fontSize: 10,
    color: t.colors.accent,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
    borderTopWidth: 1.5,
    borderTopColor: t.colors.border,
    paddingBottom: t.spacing.xl,
    backgroundColor: t.colors.bgSurface,
  },
  accessoryBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneText: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.md,
  },
}));
