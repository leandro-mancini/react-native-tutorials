import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { ChevronRight } from 'lucide-react-native';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  onPress: () => void;
  progressX: SharedValue<number>;
  total: number;
  width: number;
};

export function NextIconButton({ onPress, progressX, total, width }: Props) {
  const size = 62;
  const strokeW = 3.5;
  const r = (size - strokeW) / 2;
  const C = 2 * Math.PI * r;
  const pages = Math.max(1, total - 1);

  const animatedProps = useAnimatedProps(() => {
    const p = Math.min(Math.max(progressX.value / (width * pages), 0), 1);
    return { strokeDashoffset: C * (1 - p) };
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View style={styles.iconBtn}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={strokeW}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#FFF"
            strokeWidth={strokeW}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={C}
            animatedProps={animatedProps}
          />
        </Svg>
        <View style={styles.iconInner}>
          <ChevronRight />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
