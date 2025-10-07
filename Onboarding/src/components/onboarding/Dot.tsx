import React from 'react';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

const DOT_BASE = 8;
const DOT_ACTIVE = 22;

export function Dot({ index, width, x }: { index: number; width: number; x: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const position = x.value / width;

    const w = interpolate(position, [index - 1, index, index + 1], [DOT_BASE, DOT_ACTIVE, DOT_BASE], Extrapolation.CLAMP);
    const opacity = interpolate(position, [index - 1, index, index + 1], [0.4, 1, 0.4], Extrapolation.CLAMP);
    const scale = interpolate(position, [index - 1, index, index + 1], [1, 1.1, 1], Extrapolation.CLAMP);

    return { width: w, opacity, transform: [{ scale }] };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  dot: {
    height: DOT_BASE,
    borderRadius: 999,
    backgroundColor: '#fff',
    width: DOT_BASE,
  },
});
