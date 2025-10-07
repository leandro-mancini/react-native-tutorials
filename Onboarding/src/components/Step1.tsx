import React from 'react';
import Svg, { Defs, Pattern, Rect, Image, Circle } from 'react-native-svg';

type Props = {
  width?: number | string;
  height?: number | string;
};

export function OnboardingStep1({ width = 428, height = 448 }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 428 448">
      <Defs>
        <Pattern
          id="bgPattern"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Image
            href="../../assets/svg/onboarding_step1.png"
            width={2148}
            height={2148}
            preserveAspectRatio="none"
            transform="matrix(0.000487304 0 0 0.000465549 -0.0233645 0)"
          />
        </Pattern>
      </Defs>

      <Rect width={428} height={448} fill="url(#bgPattern)" />

      <Circle cx={113} cy={72} r={16} fill="#6BB8FF" />
      <Circle cx={301} cy={171} r={9} fill="#FF5CA1" />
      <Circle cx={92.5} cy={363.5} r={14.5} fill="#1E9E9A" />
    </Svg>
  );
}