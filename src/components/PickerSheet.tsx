/**
 * PickerSheet — kawaii bottom-sheet-style picker with pink pastel theme.
 * Uses CSS animations for slide up / backdrop fade.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { makeStyles } from '../utils/styles';
import { useTheme } from '../store/ThemeContext';
import { categoryEmojis } from '../constants/categories';

interface PickerSheetProps {
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
  onDismiss: () => void;
  visible: boolean;
  allowClear?: boolean;
  clearLabel?: string;
}

export const PickerSheet: React.FC<PickerSheetProps> = ({
  title,
  options,
  selected,
  onSelect,
  onDismiss,
  visible,
  allowClear = false,
  clearLabel = 'All',
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [closing, setClosing] = useState(false);

  const allOptions = useMemo(
    () => (allowClear ? ['', ...options] : [...options]),
    [options, allowClear]
  );

  const sheetHeight = Math.min(56 + allOptions.length * 52 + 40, window.innerHeight * 0.6);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onDismiss();
    }, 250);
  }, [onDismiss]);

  const handleSelect = useCallback((value: string) => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onSelect(value);
    }, 200);
  }, [onSelect]);

  if (!visible && !closing) return null;

  return (
    <div style={styles.overlay}>
      {/* Backdrop */}
      <div
        style={{
          ...styles.backdrop,
          animation: closing ? 'fadeOut 0.25s forwards' : 'fadeIn 0.3s forwards',
        }}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        style={{
          ...styles.sheet,
          height: sheetHeight,
          backgroundColor: theme.colors.bgSurface,
          animation: closing ? 'slideDown 0.25s forwards' : 'slideUp 0.3s ease-out',
        }}
      >
        {/* Handle bar */}
        <div style={styles.handleContainer}>
          <div style={{ ...styles.handle, backgroundColor: theme.colors.border }} />
        </div>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.title}>{'\u{1F338}'} {title}</span>
        </div>

        {/* Options list */}
        <div style={styles.listContent}>
          {allOptions.map((item) => {
            const isSelected = item === selected || (item === '' && !selected);
            const label = item || clearLabel;
            const emoji = categoryEmojis[item] ?? '';

            return (
              <div
                key={item || '__clear__'}
                style={{
                  ...styles.option,
                  ...(isSelected ? styles.optionSelected : {}),
                }}
                onClick={() => handleSelect(item)}
              >
                <span style={{
                  ...styles.optionText,
                  ...(isSelected ? styles.optionTextSelected : {}),
                }}>
                  {emoji ? `${emoji} ${label}` : label}
                </span>
                {isSelected && <span style={styles.checkmark}>{'\u2713'}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Extra keyframe for slide down */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 900,
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'relative',
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderBottomWidth: 0,
    borderColor: t.colors.border,
    display: 'flex',
    flexDirection: 'column',
  },
  handleContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.xs,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.5,
  },
  header: {
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: t.colors.border,
  },
  title: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.textPrimary,
  },
  listContent: {
    flex: 1,
    overflowY: 'auto' as const,
    paddingBottom: t.spacing.lg,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: t.spacing.md + 2,
    paddingBottom: t.spacing.md + 2,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: t.colors.border,
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: t.colors.accentMuted,
  },
  optionText: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  optionTextSelected: {
    color: t.colors.accent,
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
  },
  checkmark: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.accent,
  },
}));
