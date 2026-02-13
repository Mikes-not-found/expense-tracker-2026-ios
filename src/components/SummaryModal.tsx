/**
 * SummaryModal — monthly summary editor.
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
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.hint}>
              Write your monthly summary, reflections, and goals. This will be saved and exported with your Excel data.
            </Text>
            <TextInput
              style={styles.textarea}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
              placeholder="What happened this month? What did you spend on? Any reflections or goals for next month..."
              placeholderTextColor="#556677"
              inputAccessoryViewID={Platform.OS === 'ios' ? SUMMARY_ACCESSORY_ID : undefined}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.charCount}>{text.length} characters</Text>
            <View style={styles.actions}>
              <Button variant="ghost" onPress={handleClose}>Cancel</Button>
              <Button variant="primary" onPress={handleSave}>Save Summary</Button>
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
  hint: {
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.md,
    color: t.colors.textSecondary,
    lineHeight: 22,
    marginBottom: t.spacing.md,
  },
  textarea: {
    flex: 1,
    backgroundColor: t.colors.bgElevated,
    borderWidth: 1,
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
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    paddingBottom: t.spacing.xl,
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
