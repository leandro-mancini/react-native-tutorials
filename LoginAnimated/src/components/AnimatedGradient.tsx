import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

type Props = { children?: React.ReactNode };

export const AnimatedGradient: React.FC<Props> = ({children}) => {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(withTiming(1, {duration: 6000}), -1, true);
  }, [t]);

  const overlayA = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [1, 0]),
  }));
  const overlayB = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, overlayA]}>
        <LinearGradient
          colors={['#0ea5e9', '#7c3aed']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, overlayB]}>
        <LinearGradient
          colors={['#22c55e', '#ef4444']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});