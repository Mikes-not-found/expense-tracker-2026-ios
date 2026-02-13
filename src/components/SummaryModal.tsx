/**
 * SummaryModal — monthly summary editor.
 * TextInput multiline with character counter.
 */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Button } from './ui/Button';
import { createStyles } from '../utils/styles';

interface SummaryModalProps {
  visible: boolean;
  title: string;
  initialText: string;
  onSave: (text: string) => void;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  visible,
  title,
  initialText,
  onSave,
  onClose,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) setText(initialText);
  }, [visible, initialText]);

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
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
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
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.charCount}>{text.length} characters</Text>
          <View style={styles.actions}>
            <Button variant="ghost" onPress={onClose}>Cancel</Button>
            <Button variant="primary" onPress={() => onSave(text)}>Save Summary</Button>
          </View>
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
}));
