import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';
import { tokens } from '../theme/tokens';

type Props = {
  progress: SharedValue<number>;       // 0 = off(light) | 1 = on(dark)
  onToggle(): void;
  width?: number;
  height?: number;
};

export const ThemeToggle = memo(({ progress, onToggle, width = 180, height = 100 }: Props) => {
  // dimensões derivadas
  const R = height / 2;
  const PADDING = Math.max(6, Math.round(height * 0.125));
  const KNOB = height - PADDING * 2;
  const INNER_DOT = Math.round(KNOB * 0.46);

  const pressed = useSharedValue(0);

  // trilho: cinza → azul
  const trackStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      progress.value,
      [0, 1],
      ['#D6D6D6', tokens.dark.accent] // azul do layout
    );
    return { backgroundColor: bg };
  });

  // knob: anel no OFF, sem anel no ON; bounce no press
  const knobStyle = useAnimatedStyle(() => {
    const x = interpolate(
      progress.value,
      [0, 1],
      [PADDING, width - KNOB - PADDING],
      Extrapolation.CLAMP
    );

    const scale = withSpring(1 + pressed.value * 0.06, { mass: 0.35, stiffness: 280, damping: 20 });

    return {
      transform: [{ translateX: x }, { scale }],
    };
  });

  // dot interno: visível só no OFF e desaparece rápido até 15% da animação
  const innerDotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.15], [1, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: progress.value >= 0.5 }}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      onPress={onToggle}
      style={{ alignSelf: 'center' }}
    >
      <Animated.View style={[styles.track, { width, height, borderRadius: R }, trackStyle]}>
        {/* knob */}
        <Animated.View
          style={[
            styles.knob,
            {
              width: KNOB,
              height: KNOB,
              borderRadius: KNOB / 2,
              left: 0,
              top: PADDING,
              backgroundColor: '#FFFFFF',
            },
            knobStyle,
          ]}
        >
          {/* inner dot (apenas no OFF) */}
          <Animated.View
            style={[
              {
                width: INNER_DOT,
                height: INNER_DOT,
                borderRadius: INNER_DOT / 2,
                backgroundColor: '#C7C7C7',
              },
              innerDotStyle,
            ]}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  halo: {
    position: 'absolute',
    backgroundColor: '#000',
  },
});