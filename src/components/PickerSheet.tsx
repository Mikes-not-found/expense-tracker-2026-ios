/**
 * PickerSheet — kawaii bottom-sheet-style picker with pink pastel theme.
 * Uses Modal + Animated. Works in Expo Go.
 */
import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ITEM_HEIGHT = 52;
const HEADER_HEIGHT = 56;
const MAX_HEIGHT_RATIO = 0.6;

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
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const allOptions = useMemo(
    () => (allowClear ? ['', ...options] : [...options]),
    [options, allowClear]
  );

  const sheetHeight = useMemo(() => {
    const contentHeight = HEADER_HEIGHT + allOptions.length * ITEM_HEIGHT + 40;
    return Math.min(contentHeight, SCREEN_HEIGHT * MAX_HEIGHT_RATIO);
  }, [allOptions.length]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropAnim.setValue(0);
    }
  }, [visible, slideAnim, backdropAnim]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [slideAnim, backdropAnim, onDismiss]);

  const handleSelect = useCallback(
    (value: string) => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onSelect(value);
      });
    },
    [slideAnim, backdropAnim, onSelect]
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      const isSelected = item === selected || (item === '' && !selected);
      const label = item || clearLabel;
      const emoji = categoryEmojis[item] ?? '';

      return (
        <TouchableOpacity
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => handleSelect(item)}
          activeOpacity={0.6}
        >
          <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
            {emoji ? `${emoji} ${label}` : label}
          </Text>
          {isSelected && <Text style={styles.checkmark}>{'\u2713'}</Text>}
        </TouchableOpacity>
      );
    },
    [selected, clearLabel, styles, handleSelect]
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: Animated.multiply(backdropAnim, 0.4) },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              backgroundColor: theme.colors.bgSurface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{'\u{1F338}'} {title}</Text>
          </View>

          {/* Options list */}
          <FlatList
            data={allOptions}
            keyExtractor={(item: string) => item || '__clear__'}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const useStyles = makeStyles((t) => ({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const),
    backgroundColor: '#000',
  },
  sheet: {
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: t.colors.border,
  },
  handleContainer: {
    alignItems: 'center',
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
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  title: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.textPrimary,
  },
  listContent: {
    paddingBottom: t.spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: t.spacing.md + 2,
    paddingHorizontal: t.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  optionSelected: {
    backgroundColor: t.colors.accentMuted,
  },
  optionText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  optionTextSelected: {
    color: t.colors.accent,
    fontFamily: t.fonts.monoBold,
  },
  checkmark: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.accent,
  },
}));
