import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Mask,
  Rect,
} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  color?: string;          // cor do feixe
  intensity?: number;      // opacidade no topo (0–1)
  topWidthPct?: number;    // % largura no topo (0–1)
  bottomWidthPct?: number; // % largura na base (0–1)
  style?: ViewStyle;
};

export function Beam({
  width,
  height,
  color = '#F2C44A',
  intensity = 0.65,
  topWidthPct = 0.24,
  bottomWidthPct = 0.96,
  style,
}: Props) {
  const topW = Math.max(1, width * topWidthPct);
  const bottomW = Math.max(topW, width * bottomWidthPct);

  const p1 = [(width - topW) / 2, 0];
  const p2 = [(width + topW) / 2, 0];
  const p3 = [(width + bottomW) / 2, height];
  const p4 = [(width - bottomW) / 2, height];

  // IMPORTANTE: pares x,y separados por espaço!
  const points = `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}`;

  return (
    <Svg width={width} height={height} style={style}>
      <Defs>
        {/* Gradiente vertical – forte no topo, some na base */}
        <LinearGradient id="gY" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={intensity} />
          <Stop offset="0.55" stopColor={color} stopOpacity={intensity * 0.35} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>

        {/* Máscara para bordas suaves (branco = mostra; preto = esconde) */}
        <LinearGradient id="gX" x1="0" y1="0.5" x2="1" y2="0.5">
          <Stop offset="0"    stopColor="#fff" stopOpacity={0} />
          <Stop offset="0.14" stopColor="#fff" stopOpacity={1} />
          <Stop offset="0.86" stopColor="#fff" stopOpacity={1} />
          <Stop offset="1"    stopColor="#fff" stopOpacity={0} />
        </LinearGradient>

        <Mask id="softMask" maskUnits="userSpaceOnUse">
          <Rect width={width} height={height} fill="url(#gX)" />
        </Mask>
      </Defs>

      {/* Beam sem borda, com bordas suaves e sentido topo→base */}
      <Polygon points={points} fill="url(#gY)" mask="url(#softMask)" />
    </Svg>
  );
}