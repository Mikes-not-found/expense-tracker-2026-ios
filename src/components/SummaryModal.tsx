/**
 * SummaryModal — kawaii Kakeibo-style monthly summary editor.
 * Footer stays fixed — keyboard dismissed via Done button or tapping outside.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  InputAccessoryView,
} from 'react-native';
import { Button } from './ui/Button';
import { makeStyles } from '../utils/styles';
import { useTheme } from '../store/ThemeContext';

interface SummaryModalProps {
  visible: boolean;
  title: string;
  initialText: string;
  onSave: (text: string) => void;
  onClose: () => void;
}

const SUMMARY_ACCESSORY_ID = 'summary-modal-done';

export const SummaryModal: React.FC<SummaryModalProps> = ({
  visible,
  title,
  initialText,
  onSave,
  onClose,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) setText(initialText);
  }, [visible, initialText]);

  const handleSave = useCallback(() => {
    Keyboard.dismiss();
    onSave(text);
  }, [text, onSave]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

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
            <Text style={styles.title}>{'\u{1F33F}'} {title}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>{'\u2715'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.hint}>
              {'\u{1F375}'} Write your Kakeibo reflection — what did you spend on? What are you grateful for? What are your savings goals?
            </Text>
            <TextInput
              style={styles.textarea}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
              placeholder="This month I spent on... I'm grateful for... Next month I want to..."
              placeholderTextColor="#a8bfa0"
              inputAccessoryViewID={Platform.OS === 'ios' ? SUMMARY_ACCESSORY_ID : undefined}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.charCount}>{'\u{1F4DD}'} {text.length} characters</Text>
            <View style={styles.actions}>
              <Button variant="ghost" onPress={handleClose}>Cancel</Button>
              <Button variant="primary" onPress={handleSave}>{'\u{1F4BE}'} Save</Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* iOS Done button above keyboard — MUST be outside TouchableWithoutFeedback */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={SUMMARY_ACCESSORY_ID}>
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
    color: t.colors.green,
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
  hint: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textSecondary,
    lineHeight: 22,
    marginBottom: t.spacing.md,
  },
  textarea: {
    flex: 1,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
    lineHeight: 24,
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
    borderTopWidth: 1.5,
    borderTopColor: t.colors.border,
    paddingBottom: t.spacing.xl,
    backgroundColor: t.colors.bgSurface,
  },
  charCount: {
    fontFamily: t.fonts.mono,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: t.spacing.sm,
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
