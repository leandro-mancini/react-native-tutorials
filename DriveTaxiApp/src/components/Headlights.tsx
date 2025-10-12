import React from 'react';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, G, Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type Props = {
  /** Y exato do para-choque dianteiro, no mesmo sistema do container do carro */
  originY: number;
  /** X de cada farol (onde nasce o feixe) */
  cxLeft: number;
  cxRight: number;
  /** comprimento do feixe para cima (default 520) */
  beamHeight?: number;
  /** abertura no final do feixe (default 420) */
  bottomWidth?: number;
};

const TOP_WIDTH   = 42;    // largura no ponto de origem (estreito)
const ANGLE       = 9;     // inclinação de cada feixe

function trapezoidPathUp(cx: number, originY: number, height: number, bottomWidth: number) {
  // Y cresce pra baixo. Como o feixe vai "pra frente", subimos (originY - height)
  const y0 = originY;
  const y1 = originY - height;

  const halfTop    = TOP_WIDTH / 2;
  const halfBottom = bottomWidth / 2;

  const x0l = cx - halfTop,   x0r = cx + halfTop;
  const x1l = cx - halfBottom, x1r = cx + halfBottom;

  return `M ${x0l} ${y0} L ${x0r} ${y0} L ${x1r} ${y1} L ${x1l} ${y1} Z`;
}

export function Headlights({
  originY,
  cxLeft,
  cxRight,
  beamHeight = 520,
  bottomWidth = 420,
}: Props) {
  // “breathing” sutil
  const pulse = useSharedValue(0.9);
  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1600 }), -1, true);
  }, [pulse]);
  const pulsing = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const layer = (cx: number, rotation: number) => (
    <G origin={`${cx},${originY}`} rotation={rotation}>
      {/* camada externa – bem suave, dá o shape grande */}
      <Path d={trapezoidPathUp(cx, originY, beamHeight, bottomWidth)}
            fill="url(#beamOuter)" />
      {/* camada média – define bordas mais nítidas, ainda suave */}
      <Path d={trapezoidPathUp(cx, originY, beamHeight, bottomWidth)}
            fill="url(#beamMid)"
            transform={`translate(${cx},${originY}) scale(0.78,1) translate(${-cx},${-originY})`} />
      {/* núcleo concentrado */}
      <Path d={trapezoidPathUp(cx, originY, beamHeight, bottomWidth)}
            fill="url(#beamCore)"
            transform={`translate(${cx},${originY}) scale(0.56,1) translate(${-cx},${-originY})`} />
      {/* hotspot radial no ponto do farol */}
      <Circle cx={cx} cy={originY} r={64} fill="url(#hotspot)" />
    </G>
  );

  return (
    <AnimatedSvg style={[{ position: 'absolute', inset: 0 }, pulsing]} pointerEvents="none">
      <Defs>
        {/* gradiente vertical: forte no início, desaparece no topo */}
        <LinearGradient id="beamOuter" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0"   stopColor="#F2C75B" stopOpacity="0.30" />
          <Stop offset="0.35" stopColor="#CBAA4E" stopOpacity="0.18" />
          <Stop offset="0.75" stopColor="#9A8542" stopOpacity="0.08" />
          <Stop offset="1"   stopColor="#000"    stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="beamMid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0"   stopColor="#FFD86A" stopOpacity="0.40" />
          <Stop offset="0.5" stopColor="#E9BF56" stopOpacity="0.20" />
          <Stop offset="1"   stopColor="#000"    stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="beamCore" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0"   stopColor="#FFE489" stopOpacity="0.75" />
          <Stop offset="0.45" stopColor="#FFD060" stopOpacity="0.32" />
          <Stop offset="1"   stopColor="#000"     stopOpacity="0" />
        </LinearGradient>
        {/* brilho circular no para-choque */}
        <RadialGradient id="hotspot" cx="50%" cy="50%" r="50%">
          <Stop offset="0"   stopColor="#FFF2A1" stopOpacity="0.55" />
          <Stop offset="0.6" stopColor="#FFE17A" stopOpacity="0.25" />
          <Stop offset="1"   stopColor="#000"    stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* ESQUERDA e DIREITA – rotacionados levemente para “abrir” pra frente */}
      {layer(cxLeft, -ANGLE)}
      {layer(cxRight,  ANGLE)}
    </AnimatedSvg>
  );
}