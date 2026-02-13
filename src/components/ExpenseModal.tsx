/**
 * ExpenseModal — form for adding/editing expenses.
 * Controlled form with validation. Uses native Modal.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from './ui/Button';
import { createStyles } from '../utils/styles';
import { categorySubcategories, categoryNames } from '../constants/categories';
import type { Expense } from '../types';

interface ExpenseModalProps {
  visible: boolean;
  expense: Expense | null; // null = new, filled = edit
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
  const [form, setForm] = useState(emptyForm);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

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
      setShowPrimaryPicker(false);
      setShowSecondaryPicker(false);
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

  const selectPrimary = (cat: string) => {
    setForm((f) => ({ ...f, primary: cat, secondary: '' }));
    setShowPrimaryPicker(false);
  };

  const selectSecondary = (sub: string) => {
    setForm((f) => ({ ...f, secondary: sub }));
    setShowSecondaryPicker(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{expense ? 'Edit Expense' : 'New Expense'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
          {/* Name */}
          <Text style={styles.label}>EXPENSE NAME</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="e.g. Grocery shopping"
            placeholderTextColor="#556677"
            autoFocus={!expense}
          />

          {/* Date + Amount row */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>DAY</Text>
              <TextInput
                style={styles.input}
                value={form.date}
                onChangeText={(v) => setForm((f) => ({ ...f, date: v }))}
                placeholder="1-31"
                placeholderTextColor="#556677"
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>AMOUNT (€)</Text>
              <TextInput
                style={styles.input}
                value={form.amount}
                onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))}
                placeholder="0.00"
                placeholderTextColor="#556677"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Category */}
          <Text style={styles.label}>CATEGORY</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => {
              setShowPrimaryPicker((v) => !v);
              setShowSecondaryPicker(false);
            }}
          >
            <Text style={form.primary ? styles.pickerText : styles.pickerPlaceholder}>
              {form.primary || 'Select...'}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {showPrimaryPicker && (
            <View style={styles.optionsList}>
              {categoryNames.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.option, form.primary === cat && styles.optionActive]}
                  onPress={() => selectPrimary(cat)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      form.primary === cat && styles.optionTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Subcategory */}
          <Text style={styles.label}>SUBCATEGORY</Text>
          <TouchableOpacity
            style={[styles.picker, !form.primary && styles.pickerDisabled]}
            onPress={() => {
              if (form.primary) {
                setShowSecondaryPicker((v) => !v);
                setShowPrimaryPicker(false);
              }
            }}
            disabled={!form.primary}
          >
            <Text style={form.secondary ? styles.pickerText : styles.pickerPlaceholder}>
              {form.secondary || (form.primary ? 'Select...' : 'Select category first...')}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {showSecondaryPicker && subcategories.length > 0 && (
            <View style={styles.optionsList}>
              {subcategories.map((sub) => (
                <TouchableOpacity
                  key={sub}
                  style={[styles.option, form.secondary === sub && styles.optionActive]}
                  onPress={() => selectSecondary(sub)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      form.secondary === sub && styles.optionTextActive,
                    ]}
                  >
                    {sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="ghost" onPress={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onPress={handleSave}
            disabled={!isValid}
          >
            Save Expense
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = createStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.bgSurface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.xl + 20,
    paddingBottom: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  title: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xl,
    color: t.colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.bgInteractive,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: t.fonts.monoSemiBold,
    fontSize: t.fontSize.xs,
    color: t.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: t.spacing.sm,
    marginTop: t.spacing.md,
  },
  input: {
    backgroundColor: t.colors.bgElevated,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: t.fonts.sans,
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
    backgroundColor: t.colors.bgElevated,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pickerDisabled: {
    opacity: 0.5,
  },
  pickerText: {
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  pickerPlaceholder: {
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textMuted,
  },
  pickerArrow: {
    fontSize: 10,
    color: t.colors.accent,
  },
  optionsList: {
    backgroundColor: t.colors.bgElevated,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.sm,
    marginTop: t.spacing.xs,
    maxHeight: 200,
  },
  option: {
    paddingVertical: t.spacing.sm + 2,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    paddingBottom: t.spacing.xl,
  },
}));
