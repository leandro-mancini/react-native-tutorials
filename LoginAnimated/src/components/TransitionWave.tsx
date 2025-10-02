import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Animated, {
  type SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  /** 0..1 controla amplitude da onda (opcional) */
  progress: SharedValue<number>;
  /** translateY em px da cortina (anima SCREEN_H -> 0) */
  translateY: SharedValue<number>;
  color?: string;
  height?: number; // altura da faixa/onda no topo (ex.: 220)
};

function buildWavePath(w: number, h: number, amp: number, phase: number) {
  'worklet';
  const points = 40;
  const dx = w / points;
  const H = Math.max(1, h);
  // retângulo amarelo completo + recorte branco ondulado no topo
  let d = `M 0 0 L ${w} 0 L ${w} ${H} L 0 ${H} Z M 0 ${H * 0.55}`;
  for (let i = 0; i <= points; i++) {
    const x = i * dx;
    const y = H * 0.55 + Math.sin((i / points) * Math.PI * 2 + phase) * amp;
    d += ` L ${x} ${y}`;
  }
  d += ` L ${w} 0 L 0 0 Z`;
  return d;
}

const lerp = (a: number, b: number, t: number) => {
  'worklet';
  return a + (b - a) * t;
};

export const TransitionWave: React.FC<Props> = ({
  progress,
  translateY,
  color = '#f4cd1e',
  height = 220,
}) => {
  // fase estática (opcional: pode animar se quiser “mexer” a onda durante a subida)
  const phase = 0;

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const amp = lerp(0, 16, progress.value);
    const d = buildWavePath(SCREEN_W, height, amp, phase);
    return { d } as any;
  });

  const wrapStyle = {
    transform: [{ translateY: translateY.value }],
  };

  return (
    <Animated.View style={[styles.wrap, wrapStyle]}>
      {/* fundo amarelo sólido ocupando a tela toda */}
      <RectLike color={color} />
      {/* faixa superior com onda branca recortando para baixo */}
      <Svg width={SCREEN_W} height={height} style={styles.waveTop}>
        <Rect x={0} y={0} width={SCREEN_W} height={height} fill={color} />
        <AnimatedPath animatedProps={animatedProps} fill="#fff" />
      </Svg>
    </Animated.View>
  );
};

// retângulo amarelo full-screen (sem custo de SVG gigante)
const RectLike = ({ color }: { color: string }) => {
  return <Animated.View style={[styles.fullBg, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: SCREEN_W,
    height: SCREEN_H,
    left: 0,
    top: 0,
    zIndex: 10, // acima do conteúdo da Login
    overflow: 'hidden',
  },
  fullBg: {
    position: 'absolute',
    inset: 0,
  },
  waveTop: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});