/**
 * FloatingEmojis — animated floating emoji background layer.
 * Recreates the CSS floatEmoji animation from the kawaii HTML.
 * Uses React Native Animated API for smooth float-up animations.
 * Slow, dreamy pace — duration 25-50s, delays 5-25s.
 */
import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';

const EMOJIS = [
  '\u{1F375}', '\u{1F338}', '\u{1F496}', '\u2728', '\u{1F33F}',
  '\u{1F343}', '\u{1F33A}', '\u{1F49D}', '\u{1F337}', '\u{1F380}',
  '\u{1F33C}', '\u{1F497}', '\u{1F33B}', '\u{1F390}', '\u{1F308}',
  '\u{1F4AB}', '\u{1F98B}', '\u{1F340}', '\u2B50', '\u{1F319}',
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface FloatingEmojiConfig {
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  startY: number;
}

const FloatingEmoji: React.FC<{ config: FloatingEmojiConfig }> = ({ config }) => {
  const translateY = useRef(new Animated.Value(config.startY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT + 50);
      opacity.setValue(0);
      rotate.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: config.duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.45,
            duration: config.duration * 0.15,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.45,
            duration: config.duration * 0.6,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: config.duration * 0.25,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotate, {
          toValue: 1,
          duration: config.duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(animate, config.delay * 0.5);
      });
    };

    const timer = setTimeout(animate, config.delay);
    return () => clearTimeout(timer);
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <Animated.View
      style={[
        styles.emoji,
        {
          left: config.left,
          transform: [{ translateY }, { rotate: spin }],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <Text style={{ fontSize: config.size }}>{config.emoji}</Text>
    </Animated.View>
  );
};

export const FloatingEmojis: React.FC = () => {
  const configs = useMemo<FloatingEmojiConfig[]>(() =>
    EMOJIS.map((emoji, i) => ({
      emoji,
      left: Math.random() * (SCREEN_WIDTH - 30),
      size: 14 + Math.random() * 14,
      duration: 25000 + Math.random() * 25000,
      delay: 5000 + Math.random() * 20000,
      startY: SCREEN_HEIGHT + 50 + Math.random() * 200,
    })),
    []
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {configs.map((config, i) => (
        <FloatingEmoji key={i} config={config} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  emoji: {
    position: 'absolute',
  },
});
