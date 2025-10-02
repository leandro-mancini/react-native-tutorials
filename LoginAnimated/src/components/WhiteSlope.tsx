import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

export const WhiteSlope = () => {
  const h = 177;
  const bleed = 40;
  return (
    <Svg
      style={{ position: 'absolute', bottom: 0, left: -bleed }}
      width={width + bleed * 2}
      height={h}
      viewBox={`0 0 ${width + bleed * 2} ${h}`}
    >
      {/* Ajuste os pontos para o ângulo desejado */}
      <Path
        d={`M0,30 L${width + bleed * 2},0 L${width + bleed * 2},${h} L0,${h} Z`}
        fill="#F5F5F5"
      />
    </Svg>
  );
};