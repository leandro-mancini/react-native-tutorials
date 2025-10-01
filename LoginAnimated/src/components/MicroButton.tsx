import React, {useCallback} from 'react';
import {Pressable, Text, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';

type Props = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export const MicroButton: React.FC<Props> = ({label, onPress, style, disabled}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.98, {duration: 80});
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, {duration: 120});
    glow.value = withSequence(withTiming(1, {duration: 120}), withTiming(0, {duration: 200}));
  }, [scale, glow]);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    shadowOpacity: 0.25 + glow.value * 0.4,
  }));

  return (
    <Animated.View style={[styles.container, aStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        android_ripple={{color: 'rgba(255,255,255,0.2)'}}
        style={styles.pressable}
        disabled={disabled}>
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 8},
  },
  pressable: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    // 'backdropFilter' não existe no RN puro. Mantemos somente visual base.
  },
  text: {color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.4},
});