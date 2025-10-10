import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { tokens } from '../theme/tokens';

type Props = {
  progress: SharedValue<number>; // 0..1
  onToggle(): void;
};

const WIDTH = 180;
const HEIGHT = 64;
const KNOB = 52;
const PADDING = (HEIGHT - KNOB) / 2;

export const ThemeToggle = memo(({ progress, onToggle }: Props) => {
  const pressed = useSharedValue(0);

  const trackStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      progress.value,
      [0, 1],
      [tokens.light.track, tokens.dark.accent]
    );
    return { backgroundColor: bg };
  });

  const knobStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [PADDING, WIDTH - KNOB - PADDING],
      Extrapolation.CLAMP
    );
    const scale = withSpring(1 + pressed.value * 0.06, { mass: 0.4, stiffness: 260, damping: 18 });
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  const ringStyle = useAnimatedStyle(() => {
    const opacity = withTiming(pressed.value ? 0.18 : 0, { duration: 120 });
    return { opacity };
  });

  return (
    <Pressable
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      onPress={onToggle}
      style={styles.pressable}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: { alignSelf: 'center' },
  track: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    left: PADDING - 4,
    width: KNOB + 8,
    height: KNOB + 8,
    borderRadius: (KNOB + 8) / 2,
    backgroundColor: '#000',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: tokens.light.knob,
  },
});