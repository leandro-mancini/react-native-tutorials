import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedProps,
  type SharedValue,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  width: number;
  height: number;
  color?: string;
  progress?: SharedValue<number>; // timeline compartilhada 0..1
};

function buildWavePath(w: number, h: number, amp: number, phase: number) {
  'worklet';
  const points = 40;
  const dx = w / points;
  const H = Math.max(1, h);

  let d = `M 0 0 L ${w} 0 L ${w} ${H} L 0 ${H} Z M 0 ${H * 0.55}`;
  for (let i = 0; i <= points; i++) {
    const x = i * dx;
    const y = H * 0.55 + Math.sin((i / points) * Math.PI * 2 + phase) * amp;
    d += ` L ${x} ${y}`;
  }
  d += ` L ${w} 0 L 0 0 Z`;
  return d;
}

// lerp worklet
const lerp = (a: number, b: number, t: number) => {
  'worklet';
  return a + (b - a) * t;
};

export const WaveHeader: React.FC<Props> = ({ width, height, color = '#f4cd1e', progress }) => {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(withTiming(Math.PI * 2, { duration: 4500 }), -1);
  }, [phase]);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const t = progress ? progress.value : 1;
    const amp = lerp(0, 16, t);          // só a “vida” da onda
    const d = buildWavePath(width, height, amp, phase.value); // height FIXO
    return { d } as any;
  });

  return (
    <Svg width={width} height={height} style={styles.svg}>
      <Rect x={0} y={0} width={width} height={height} fill={color} />
      <AnimatedPath animatedProps={animatedProps} fill="#fff" />
    </Svg>
  );
};

const styles = StyleSheet.create({
  svg: { position: 'absolute', top: 0, left: 0 },
});
