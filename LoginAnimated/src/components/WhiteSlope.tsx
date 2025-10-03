import React from "react";
import { Dimensions, StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_W } = Dimensions.get("window");

type Props = {
  color?: string;              // cor da faixa
  bleed?: number;              // sobra lateral para cobrir bordas
  height?: number;             // altura do “cap” quando não-esticado
  slope?: number;              // inclinação (diferença entre topo esq e topo dir)
  anchor?: "top" | "bottom";   // onde ancorar dentro do container
  stretch?: boolean;           // se true, estica no eixo Y (ocupa 100% da altura do container)
  style?: StyleProp<ViewStyle>;
};

export const WhiteSlope: React.FC<Props> = ({
  color = "#fff",
  bleed = 40,
  height = 177,
  slope = 30,
  anchor = "bottom",
  stretch = false,
  style,
}) => {
  const W = SCREEN_W + bleed * 2;
  const VP_H = stretch ? 100 : height;

  // Borda inclinada no topo do path
  const d = `M0,${slope} L${W},0 L${W},${VP_H} L0,${VP_H} Z`;

  const svgStyle: any = [
    { position: "absolute", left: -bleed },
    anchor === "bottom" ? { bottom: 0 } : { top: 0 },
    style,
  ];

  return (
    <Svg
      style={svgStyle}
      width={W}
      height={stretch ? ("100%" as any) : height}
      viewBox={`0 0 ${W} ${VP_H}`}
      preserveAspectRatio={stretch ? "none" : "xMidYMid slice"}
    >
      <Path d={d} fill={color} />
    </Svg>
  );
};