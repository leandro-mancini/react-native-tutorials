import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  progress: SharedValue<number>;
  size?: number;
  ringThickness?: number;
};

export const AxisDial = memo(({ progress, size = 240, ringThickness = 14 }: Props) => {
  const cx = size / 2;
  const cy = size / 2;

  const dialStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [0, 1], [-45, 225])}deg`,
      },
    ],
  }));

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const x = e.x - cx;
      const y = e.y - cy;
      const angle = Math.atan2(y, x);
      const norm = (angle + Math.PI) / (2 * Math.PI);
      const mapped = (norm + 0.25) % 1;
      progress.value = mapped;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width: size, height: size }, styles.center]}>
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            dialStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  ring: {
    position: 'absolute',
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});