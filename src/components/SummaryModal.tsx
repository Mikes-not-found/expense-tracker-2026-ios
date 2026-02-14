/**
 * SummaryModal — kawaii Kakeibo-style monthly summary editor.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { makeStyles } from '../utils/styles';

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
  const styles = useStyles();
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) setText(initialText);
  }, [visible, initialText]);

  const handleSave = useCallback(() => {
    onSave(text);
  }, [text, onSave]);

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.root}>
        <div style={styles.header}>
          <span style={styles.title}>{'\u{1F33F}'} {title}</span>
          <button onClick={onClose} style={styles.closeBtn}>
            <span style={styles.closeText}>{'\u2715'}</span>
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.hint}>
            {'\u{1F375}'} Write your Kakeibo reflection — what did you spend on? What are you grateful for? What are your savings goals?
          </div>
          <textarea
            style={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="This month I spent on... I'm grateful for... Next month I want to..."
          />
        </div>

        <div style={styles.footer}>
          <span style={styles.charCount}>{'\u{1F4DD}'} {text.length} characters</span>
          <div style={styles.actions}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{'\u{1F4BE}'} Save</Button>
          </div>
        </div>
      </div>
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
    height: '90%',
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
    color: t.colors.green,
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
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    paddingTop: t.spacing.lg,
  },
  hint: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textSecondary,
    lineHeight: '22px',
    marginBottom: t.spacing.md,
  },
  textarea: {
    flex: 1,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
    fontFamily: t.fonts.sans,
    fontWeight: t.fontWeights.sans,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
    lineHeight: '24px',
    minHeight: 200,
    resize: 'none' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.xl,
    borderTopWidth: 1.5,
    borderTopStyle: 'solid',
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.bgSurface,
  },
  charCount: {
    fontFamily: t.fonts.mono,
    fontWeight: t.fontWeights.mono,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: t.spacing.sm,
  },
}));
